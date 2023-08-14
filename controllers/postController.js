const mongoose=require('mongoose');
const asyncHandler = require('express-async-handler');

const editorjsParseToHtml = require('../modules/editorjs-parse-to-html.js');

const Post = require('../models/postModel.js');
const Author= require('../models/authorModel.js');

// Creation and editing of post is admin activity and is present in dashboard controller

exports.showPost= asyncHandler(async function(req,res){
    const post= await Post.findById(req.params.postId);

    if(post) {
	res.render("post",{
	    post,
	    content: editorjsParseToHtml(post.content)
	});
    }
    else
	res.sendStatus(404);
});


/*
  Returns metadata of blog posts matching filters.

  q : returns only those posts which have this as substring of title
  or exact _id

  author : returns only the posts by this author
  fromDate : returns only the posts updated after this date
  toDate : returns only the posts updated before this date
 */
exports.getPostAPI= asyncHandler(async function(req,res){
    let queryObj={};
    
    if(req.query.q)
    {
	try {// convert to id if possible
	    let possibleId= new mongoose.Types.ObjectId(req.query.q);
	    queryObj["$or"]=[
		{title: {$regex: req.query.q, $options: "i"}},
		{_id: possibleId}
	    ];
	} catch(err) {
	    queryObj["title"]= {$regex: req.query.q, $options: "i"};
	}
    }

    if(req.query.author)
    {
	const author= await Author.findOne({name: req.query.author});
	// If author is not present just ignore it.
	// Non-existing author should not come from GUI, so manually
	// crafted incorrect parameter is acceptable to ignore
	if(author){
	    queryObj["author"]= author._id;
	}
    }

    let timeCondition=[];
    if(req.query.fromDate)
	timeCondition.push({lastEditedOn: {$gte: req.query.fromDate }});
    /* mongodb $lte operator for date compares including time component.
       
       i.e. input date is converted to date:00:00:00, so any timestamp
       stored on that day like date:xx:yy:zz is after the comparator,
       ∴ is not matched

       below hack sets time part to include the given day
     */
    if(req.query.toDate)
	timeCondition.push({lastEditedOn: {$lte: req.query.toDate+"T23:59:59" }});
    
    switch(timeCondition.length)
    {
	case 1:			// merge fields of of queryobj and the single condition
	queryObj={...queryObj,...timeCondition[0]};
	break;
	case 2:
	queryObj["$and"]=timeCondition;
	break;
	//case 0: just ignore
    }    

    const results= await Post.find(
	queryObj,
	"title author createdOn lastEditedOn",
	{sort: {lastEditedOn: -1}}
    ).populate("author","name");
    
    res.send(results);
});

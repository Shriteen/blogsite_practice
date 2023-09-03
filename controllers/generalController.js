const mongoose=require('mongoose');
const asyncHandler = require('express-async-handler');

const Post = require('../models/postModel.js');
const Author= require('../models/authorModel.js');

exports.home= asyncHandler(async function(req,res){
    const posts= await Post.find({},
				 ['title','author','lastEditedOn','createdOn'],
				 {
				     sort: {
					 lastEditedOn: -1
				     }
				 }
				).populate('author');
    
    res.render('index',{
	title: "Welcome to Blogsite",
	allPosts: posts
    });
});

exports.searchPage= asyncHandler(async function(req,res){
    const {body: results} = await req.uest({
	url: '/posts/search?'+ req.originalUrl.split("?")[1],
    });

    const [allAuthors,allTags]= await Promise.all([
	Author.find(),
	Post.aggregate([{$unwind:'$tags'},{ "$group": { "_id": "$tags" }}])
    ]);

    if(req.query.tags){
	if(!(Array.isArray(req.query.tags)))
	    req.query.tags= [req.query.tags];
    } else
	req.query.tags= [];

    
    const title= (req.query.q)? req.query.q+" at Blogsite": "Search results";
    res.render('search',{
	title,
	results,
	query: req.query,
	allAuthors,
	allTags: allTags.map(({ _id }) => _id)
    });
});


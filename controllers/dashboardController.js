const asyncHandler = require('express-async-handler');
const {body, validationResult}= require('express-validator');

const Author = require('../models/authorModel.js');
const Admin = require('../models/adminModel.js');
const Post = require('../models/postModel.js');

exports.dashboard= asyncHandler(async function(req,res){
    const admin=await Admin.findById(req.session.userid).exec();
    res.render('dashboard',{
	admin: admin.username
    });
});

exports.createPost= asyncHandler(async function(req,res){
    
    const [allAuthors, admin, allTags] = await Promise.all([
	Author.find().exec(),
	Admin.findById(req.session.userid).exec(),
	Post.aggregate([{$unwind:'$tags'},{ "$group": { "_id": "$tags" }}])
    ]);
    
    res.render('post_form',{
	title: 'Create Post',
	allAuthors: allAuthors,
	allTags: allTags.map(({ _id }) => _id),
	author: admin.username
    });
});

exports.createPostHandle= [
    body("title","Title must be provided")
	.trim()
	.isLength({min: 1})
	.escape(),
    body("author","Author must be provided")
	.trim()
	.isLength({min: 1})
	.escape(),
    body("tags","tags: Invalid JSON")
	.optional()
	.isJSON()
	.bail()
	.customSanitizer(tags=> JSON.parse(tags)),
    body("tags.*","Empty tags are invalid")
	.trim()
	.isLength({min: 1})
	.escape() ,
    body("editorjs")
	.notEmpty()
	.withMessage('Editorjs data not found!'),
    asyncHandler(async function(req,res){
	const errors= validationResult(req);
	
	let author;
	if(req.body.author)
	    //express-validator just lists errors, we handle the error
	    //later.. The code in function runs regardless of tests
	    //have passed or failed. Hence existance of non-empty string is checked
	{
	    author= await Author.findOneAndUpdate(
		{name: req.body.author},
		{},
		{
		    new: true,
		    upsert: true
		});
	}

	// Note that below does not need any checking as we don't save
	// until we check for errors. Above code was also saving into
	// the DB
	const post= await (await new Post({
	    title: req.body.title,
	    author: author._id,
	    content: req.body.editorjs,
	    editorAdmins: [ req.session.userid ], // When creating only one admin is relevant
	    comments: [],
	    tags: req.body.tags
	})).populate("author");

	if(!errors.isEmpty())
	{
	    const [allAuthors, allTags]= await Promise.all( [
		Author.find().exec(),
		Post.aggregate([{$unwind:'$tags'},{ "$group": { "_id": "$tags" }}])
	    ]);
	    
	    res.render('post_form',{
		title: 'Create Post',
		allAuthors,
		post,
		allTags: allTags.map(({ _id }) => _id),
		oldData: req.body.editorjs,
		errors: errors.array()
	    });
	}
	else
	{
	    await post.save();
	    res.redirect(post.url);
	}
    })
];

exports.editPost= asyncHandler(async function(req,res){
    
    const [post,allAuthors,allTags]= await Promise.all([
	Post.findById(req.params.postId).populate('author'),
	Author.find().exec(),
	Post.aggregate([{$unwind:'$tags'},{ "$group": { "_id": "$tags" }}])
    ]);

    if(post) {
	res.render('post_form',{
	    title: 'Edit Post: '+ post.title ,
	    allAuthors,
	    allTags: allTags.map(({ _id }) => _id),
	    post,
	    oldData: post.content
	});
    }
    else
	res.sendStatus(404);    
    
});

exports.editPostHandle= [
    body("title","Title must be provided")
	.trim()
	.isLength({min: 1})
	.escape(),
    body("author","Author must be provided")
	.trim()
	.isLength({min: 1})
	.escape(),
    body("tags","tags: Invalid JSON")
	.optional()
	.isJSON()
	.bail()
	.customSanitizer(tags=> JSON.parse(tags)),
    body("tags.*","Empty tags are invalid")
	.trim()
	.isLength({min: 1})
	.escape() ,
    body("editorjs")
	.notEmpty()
	.withMessage('Editorjs data not found!'),
    asyncHandler(async function(req,res){
	const errors= validationResult(req);

	let author;
	if(req.body.author)
	    //express-validator just lists errors, we handle the error
	    //later.. The code in function runs regardless of tests
	    //have passed or failed. Hence existance of non-empty string is checked
	{
	    author= await Author.findOneAndUpdate(
		{name: req.body.author},
		{},
		{
		    new: true,
		    upsert: true
		});
	}
	
	const post= await (await Post.findById(req.params.postId))?.populate("author");
	
	if(post)
	    // edit post form shouldn't allow invalid Id to be
	    // submitted, but manually crafted attack is possible
	{
	    if(!errors.isEmpty())
	    {
		post.title=req.body.title;
		post.author=author._id;
		post.content=req.body.editorjs;
		
		const [allAuthors, allTags]= await Promise.all( [
		    Author.find().exec(),
		    Post.aggregate([{$unwind:'$tags'},{ "$group": { "_id": "$tags" }}])
		]);		
		
		res.render('post_form',{
		    title: 'Edit Post: '+ post.title,
		    allAuthors,
		    allTags: allTags.map(({ _id }) => _id),
		    post,
		    oldData: req.body.editorjs,
		    errors: errors.array()
		});
	    }
	    else
	    { // Valid
		// Doing again as $addToSet can only be used with
		// query, not as changing value of member array
		const updatedPost= await Post.findByIdAndUpdate(
		    req.params.postId,
		    {
			title: req.body.title,
			author: author._id,
			tags: req.body.tags,
			content: req.body.editorjs,
			$addToSet: { editorAdmins: [ req.session.userid ] }
		    }
		);
		
		res.redirect(updatedPost.url);
	    }
	}
	else
	    res.sendStatus(404);
    })
];

exports.deletePost= asyncHandler(async function(req,res){
    //Make sure given post is deleted, ignore if post does not exist
    const post= await Post.findByIdAndRemove(req.params.postId);
    res.redirect('back');
});

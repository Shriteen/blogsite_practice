const asyncHandler = require('express-async-handler');

const editorjsParseToHtml = require('../modules/editorjs-parse-to-html.js');

const Post = require('../models/postModel.js');

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


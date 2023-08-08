const express= require('express');

module.exports= function editorJsParseStringToObject(req,res,next) {
    if(req.body.editorjs)
    {
	try{
	    req.body.editorjs=JSON.parse(req.body.editorjs);
	    next();
	} catch(err) {
	    next(err);
	}
    }
    else
	next(new Error("req.body.editorjs is empty"));
};

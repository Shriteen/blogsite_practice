const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

const Admin=require('../models/adminModel');

exports.authenticate= asyncHandler(async function(req,res,next){
    if(req.session.userid)
	next();
    else
	next(new Error("User not logged in"));
});

exports.loginRedirect= function(err,req,res,next){
    console.log(err.message);
    res.redirect("/admin/login");
};

// prevents login page being visited while logged in
exports.alreadyLoggedIn= function(req,res,next){
    if(req.session.userid)
	res.redirect('dashboard');
    else
	next();
};


exports.login_get=asyncHandler(async function(req,res){
    res.render('admin_login');
});

exports.login_post= [
    body("username")
	.trim()
	.isLength({min: 1})
	.escape()
	.withMessage("username must be specified"),
    body("password")
	.trim()
	.isLength({min: 8})
	.escape()
	.withMessage("Password must have minimum 8 characters"),
    asyncHandler(async (req,res,next)=>{
	const errors= validationResult(req);
	if(!errors.isEmpty())
	{
	    //validation error
	    res.render("admin_login", {
		errors: errors.array()
	    });
	    return;
	}
	else
	{
	    const user= await Admin.findOne({username: req.body.username});

	    if(!user)
	    {
		//user does not exist
		res.render("admin_login", {
		    errors: [{msg: "Invalid username!"}]
		});
		return;
	    }
	    else
	    {
		if(user.verifyPassword(req.body.password))
		{
		    // verified
		    req.session.userid=user._id;
		    res.redirect("dashboard");
		}
		else
		{
		    // wrong password
		    res.render("admin_login", {
			errors: [{msg: "Incorrect password!"}]
		    });
		    return;
		}
	    }
	}
    })
];


exports.logout= asyncHandler(function(req,res,next) {
    req.session.destroy();
    res.redirect("login");
});

exports.change_password_get= asyncHandler(async function(req,res){
    const user=await Admin.findById(req.session.userid);
    //assuming user exists as authentication on the route will check it
    res.render('admin_password_change',{user});
});

exports.change_password_post= [
    body("password")
	.trim()
	.isLength({min: 8})
	.escape()
	.withMessage("Password must have minimum 8 characters"),
    body("confirm")
	.trim()
	.isLength({min: 8})
	.escape()
	.withMessage("Password must have minimum 8 characters"),
    asyncHandler(async (req,res,next)=>{
	const errors= validationResult(req);

	const user=await Admin.findById(req.body.userid);
	
	if(!errors.isEmpty())
	{
	    //validation error
	    res.render("admin_password_change", {
		user,
		errors: errors.array()
	    });
	    return;
	}
	else
	{
	    if(!user)
	    {
		//user does not exist
		console.log('Change password: given user does not exist');
		//control should not reach here, redirect to login in case
		res.redirect('login');
		return;
	    }
	    else
	    {
		if(!(req.body.password===req.body.confirm))
		{
		    //mismatch
		    res.render("admin_password_change", {
			user,
			errors: [{msg: "The two passwords do not match!"}]
		    });
		    return;
		}
		else
		{
		    // verified
		    user.password= req.body.password;
		    await user.save();
		    res.redirect('dashboard');
		}
	    }
	}
    })
];    

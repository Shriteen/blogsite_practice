// Contains all routes related to administration including access
// management and management of posts

const express= require('express');
const router= express.Router();

const adminController= require('../controllers/adminController');
const dashboardController= require('../controllers/dashboardController');
const editorjsImageHandler= require('../modules/editorjs-image-handler')('public/images');
const editorjsParseStringToObject = require('../modules/editorjs-parse-string-to-object');

// access management routes


router.get('/login',[ adminController.alreadyLoggedIn,
		      adminController.login_get ]);
router.post('/login',[ adminController.alreadyLoggedIn,
		       adminController.login_post ]);

// set authentication middleware
router.all('/*', adminController.authenticate);
router.use('/*', adminController.loginRedirect);


// all routes below are authenticated

router.get('/logout', adminController.logout);

router.get('/changePassword', adminController.change_password_get);
router.post('/changePassword', adminController.change_password_post);



// management routes

router.get('/dashboard', dashboardController.dashboard);

router.use('/', editorjsImageHandler);  // for handling editorjs image uploads
router.get('/createPost', dashboardController.createPost);
router.post('/createPost',editorjsParseStringToObject,
	                  dashboardController.createPostHandle );

// The image upload handler for create post will not work as it sends
// to the path at which form is hosted/editorJsImageHandler
// The edit URL has extra component which makes it send to editPost
router.use('/editPost', editorjsImageHandler);  
router.get('/editPost/:postId([a-f0-9]{24})', dashboardController.editPost);
router.post('/editPost/:postId([a-f0-9]{24})',editorjsParseStringToObject,
 	                                      dashboardController.editPostHandle );



module.exports=router;

const express= require('express');
const router= express.Router();

const postController= require('../controllers/postController');
const generalController= require('../controllers/generalController');


// Creation and editing of post is admin activity and is present in admin route

router.get('/:postId([a-f0-9]{24})', postController.showPost );

router.get('/search', postController.getPostAPI);

router.get('/searchPage', generalController.searchPage);

module.exports=router;

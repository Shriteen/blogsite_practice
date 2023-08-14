const express= require('express');
const router= express.Router();

const postController= require('../controllers/postController');

// Creation and editing of post is admin activity and is present in admin route

router.get('/:postId([a-f0-9]{24})', postController.showPost );

router.get('/search', postController.getPostAPI);

module.exports=router;

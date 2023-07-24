const express= require('express');
const router= express.Router();

const adminController= require('../controllers/adminController')

router.get('/login',adminController.login_get);
router.post('/login',adminController.login_post);

router.all('/*', adminController.authenticate);
router.use('/*', adminController.loginRedirect);

router.get('/dashboard', adminController.dashboard);

router.get('/logout', adminController.logout);


module.exports=router;

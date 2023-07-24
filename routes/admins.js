const express= require('express');
const router= express.Router();

const adminController= require('../controllers/adminController')

router.get('/login',[ adminController.alreadyLoggedIn,
		      adminController.login_get ]);
router.post('/login',[ adminController.alreadyLoggedIn,
		       adminController.login_post ]);

// set authentication middleware
router.all('/*', adminController.authenticate);
router.use('/*', adminController.loginRedirect);


// all routes below are authenticated

router.get('/dashboard', adminController.dashboard);

router.get('/logout', adminController.logout);


module.exports=router;

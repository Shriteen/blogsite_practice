var express = require('express');
var router = express.Router();

const generalController = require('../controllers/generalController.js');

router.get('/', generalController.home );

module.exports = router;

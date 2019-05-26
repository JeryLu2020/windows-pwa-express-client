var express = require('express');
var router = express.Router();

const userServices  = require('../config/users-services');

/* GET users listing. */
router.get('/', userServices.userProfile);

router.post('/edit/:Id', userServices.update);

// register
router.post('/register', userServices.userregister);

// login
router.post('/login', userServices.userlogin);

// logout
router.get('/logout', userServices.userlogout);

//check if username already exist
router.post('/checkname', userServices.checkName);

module.exports = router;

var express = require('express');
var router = express.Router();

// const userServices  = require('../config/users-services');

router.get('/', (req,res)=>{
    res.render('account');
});

router.get('/create', (req,res)=>{
    // read contry-state data from local and 
    res.render('account-create');
});

router.get('/create/email', (req,res)=>{
    res.render('account-email');
});




module.exports = router;

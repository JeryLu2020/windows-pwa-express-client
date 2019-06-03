var express = require('express');
var router = express.Router();

// const userServices  = require('../config/users-services');

router.get('/', (req,res)=>{
    res.render('account');
});

router.get('/create', (req,res)=>{
    res.render('account-create');
});




module.exports = router;

var express = require('express');
var router = express.Router();

// const userServices  = require('../config/users-services');

router.get('/', (req,res)=>{
    res.render('account', { layout: 'layout', title: 'VIP'});
});



module.exports = router;

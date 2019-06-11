var express = require('express');
var router = express.Router();
var country = require('countryjs');

router.get('/', (req,res)=>{
    res.render('account');
});

router.get('/create', (req,res)=>{
    res.render('account-create');
});

router.get('/create/details', (req,res)=>{
    res.render('account-create-details');
});

router.post('/create/get_state', (req, res)=> {
    var states = country.states(req.body.country_name);
    if(states) {
        return res.send(states);
    } else {
        return res.render('error', { errmsg: err });
    }
});

router.get('/create/get_city', (req, res)=>{

});

router.get('/create/email', (req,res)=>{
    res.render('account-email');
});


module.exports = router;


// get state by country https://www.npmjs.com/package/countryjs
// get city by state
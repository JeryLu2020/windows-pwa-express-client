var express = require('express');
var router = express.Router();
var country = require('countryjs');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");

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

router.post('/create/verifyEmail', (req,res)=>{
    var eamilAddress = (req.body.email_address);
    const msg = {
        to: eamilAddress,
        from: 'test@example.com',
        subject: 'Verfy your code for registration',
        text: 'below is the code',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg, (error, result) => {
        if (error) {
            return res.render('error', { errmsg: err });
        }
        else {
            return res.render('account-email-success', { email: eamilAddress});
        }
    });
});


module.exports = router;


// get state by country https://www.npmjs.com/package/countryjs
// get city by state
var express = require('express');
var router = express.Router();
var country = require('countryjs');
const sgMail = require('@sendgrid/mail');

const Hero = require('../config/database');

sgMail.setApiKey("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");

router.get('/', (req,res)=>{
    res.render('account');
});

// user login
router.get('/login', (req, res)=>{
    res.render('account-login');
});

// user login
router.post('/login', (req, res)=>{
    var email = req.body.email;
    if(email != null){
        return res.render('account-login', { email : email });
    } else {
        return res.redirect('/account/login');
    }
});

// user login success page



// user create first page
router.get('/create', (req,res)=>{
    res.render('account-create');
});

// user create detail page
router.post('/create/details', (req,res)=>{
        req.session.username = req.body.username;
        req.session.email = req.body.email;
        req.session.password = req.body.password;
    if(req.session.username){
        console.log(req.session.username + req.session.email + req.session.password);
        return res.render('account-create-details');
    } else {
        return res.render('error', { errmsg: "empty username, please register again" });
    }
});

// store user info to database
router.post('/register', (req, res) => {
    const hero = new Hero({
        first_name: req.body.first_name || 'Unknown name',
        middle_initial: req.body.middle_initial || 'N/A',
        last_name: req.body.last_name || 'N/A',

        street_address: req.body.street_address || 'N/A',
        company_address: req.body.company_address || "N/A",

        country_name: req.body.country_name || 'N/A',
        state_name: req.body.state_name || 'N/A',
        city_name: req.body.city_name || 'N/A',
        
        username: req.session.username || 'Undefined',
        password: req.session.password || '',
        email: req.session.email || 'Undefined',
    });

    hero.save()
        .then(data=>{
            return res.redirect('/account/create/email');
        })
        .catch(err =>{
            return res.render('error', { errmsg: "please try again" });
        })

});

// get state info
// get state by country https://www.npmjs.com/package/countryjs
router.post('/create/get_state', (req, res)=> {
    var states = country.states(req.body.country_name);
    if(states) {
        return res.send(states);
    } else {
        return res.render('error', { errmsg: err });
    }
});

// get city info
router.get('/create/get_city', (req, res)=>{

});


// email verification page
router.get('/create/email', (req,res)=>{
    res.render('account-email');
});

// email sent result page
router.post('/create/verifyEmail', (req,res)=>{
    var eamilAddress = (req.body.email_address);
    const msg = {
        to: eamilAddress,
        from: 'test@webasian.net',
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
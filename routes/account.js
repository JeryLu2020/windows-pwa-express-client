var express = require('express');
var router = express.Router();
var country = require('countryjs');
var unirest = require('unirest');
var countrystatecity= require('countrycitystatejson')

const Hero = require('../config/database');

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
router.post('/login/success', (req, res) => {
    // get infomation
    var logindatetime = Date().toString();
    var wholeip = req.headers['x-forwarded-for'] || req.ip; // x-forward-for is for proxy
    var ip = wholeip.split(":")[0];
    var os = req.headers['user-agent'];
    var number = 1;

    let loginemail = req.body.email;
    let loginpassword = req.body.password;

    if(loginemail=="admin@admin.com" && loginpassword=="Admin123"){
        return res.render('error', { errmsg: "You are not allowed to login as admin" });
    } else {
        // find users id
        Hero.findOne({ email: loginemail, password: loginpassword})
            .then(data=>{
                if(!data){
                    return res.render('error', { errmsg: 'no record' });
                }
                console.log('login success' + data._id);
                // let userProfiler = JSON.parse(JSON.stringify(data));
                // console.log("jsonobj:" + userProfiler[0]._id);
                req.session.userId = data._id;
                req.session.loggedIn = true;

                updateactivity(data._id, logindatetime, ip, os, number);

                // redirect to home page after success login
                return res.redirect('/');
            })
            .catch(err=>{
                return res.render('error', { errmsg: err });
            });
    }
});
// update user activity
function updateactivity (mongoid, logindatetime, ip, os, number) {
    Hero.updateOne( { _id : mongoid }, { 
        $addToSet: {
            heroactivitylog:
                { 
                    loginDateTime : logindatetime,
                    loginSuccess  : true,
                    device_ip : ip,
                    device_os  : os,
                    loginnumber: number++,
                }
        },
    }, {new: true})
        .then(data => {
            if(!data){
                console.log('updateactivity failed');
            }
            console.log('updateactivity success');
        })
        .catch(err=>{
            console.log('updateactivity failure' + err);
        });
}

// user create first page
router.get('/create', (req,res)=>{
    res.render('account-create');
});

// check whether username is already taken
router.post('/checkname', (req, res)=> {
     Hero.findOne({ username: req.body.username})
        .then(data=>{
            if(!data){
                return res.send("ok");
            }
            return res.send("no");
        })
        .catch(err=>{
            return res.render('error', { errmsg: err });
        });
})

// user create detail page
router.post('/create/details', (req,res)=>{
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.password = req.body.password;

    if(req.body.username){
        return res.render('account-create-details');
    } else{
        return res.render('error', { errmsg: "please fill in register form first" });
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
    // console.log(states);
    if(states) {
        return res.send(states);
    } else {
        return res.render('error', { errmsg: err });
    }
});

// get city info
// get city by state https://github.com/khkwan0/countryCityStateJson
router.post('/create/get_city', (req, res)=>{
    var cities = countrystatecity.getCities(req.body.country_name,req.body.state_name);
    // console.log(cities);
    if(cities) {
        return res.send(cities);
    } else {
        return res.render('error', { errmsg: err });
    }
});


// email verification page
router.get('/create/email', (req,res)=>{
    res.render('account-email', { email: req.session.email });
});

// email sent result page
router.post('/create/verifyEmail', (req,res)=>{
    var eamilAddress = (req.body.email_address);
    unirest.post("https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send")
    .header("X-RapidAPI-Host", "rapidprod-sendgrid-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "5216348952mshebe5b6014a65109p1067e3jsnb192c465fd0c")
    .header("Content-Type", "application/json")
    .send({"personalizations":
    [
        {
            "to":[{"email":eamilAddress}],
            "subject":"Hello, World!"
        }
    ],
    "from":{"email":"from_address@example.com"},
    "content":
    [
        {"type":"text/plain","value":"Hello, World!"}
    ]})
    .end(function (result) {
        console.log(result.status);
        // console.log(result.headers);
        // console.log(result.body);
        if(result.status == 202 || result.status == 200){
            res.render('account-email-success', { email: eamilAddress });
        } else {
            return res.render('error', { errmsg: "please go back and try again" });
        }
    });
});

// user logout
router.get('/logout', (req, res)=>{
    if (req.session.userId) {
        // delete session object
        req.session.destroy(function (err) {
          if (err) {
              return res.render('error', { errmsg: err });
          } else {
              return res.redirect('/');
          }
        });
      }
      else{
          return res.redirect('/');
      }
});

// user profile
router.get('/profile', (req, res)=> {
    if(req.session.userId){
        Hero.findById(req.session.userId)
            .then(data=>{
                if(!data){
                    return res.render('error', { errmsg: 'no record' });
                }
                console.log('findOne success11' + data);
                console.log("data.heroactivitylog" + data.heroactivitylog);
                return res.render('account-profile', { 
                    layout: 'layout', 
                    userprofiler : data,
                    loginactivity : data.heroactivitylog,
                });
            })
            .catch(err=>{
                return res.render('error', { errmsg: err });
            });
    }
    else {
        res.render('error', { errmsg: "Please Login" });
    }
});


module.exports = router;
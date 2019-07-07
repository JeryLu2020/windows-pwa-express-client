var express = require('express');
var router = express.Router();
var webpush = require('web-push');
const Hero = require('../config/database');

/* GET home page. */
router.get('/', function (req, res) {
    if(req.session.userId){
        Hero.findById(req.session.userId)
            .then(data=>{
                if(!data){
                    return res.render('error', { errmsg: err });
                }
                console.log('findOne success');
                return res.render('index', { layout: 'layout', title: 'VIP', userprofiler : data.email});
            })
            .catch(err=>{
                if(err.kind === 'ObjectId'){
                    console.log(req.session.userId);
                    return res.render('error', { errmsg: err });
                }
                return res.render('error', { errmsg: err });
            });
    }
    else {
        res.render('index', { title: 'Express Sample App' , userprofiler: req.session.userId});
    }
});

/* GET map page. */
router.get('/map', function (req, res) {
    res.render('map');
});

router.get('/offline.html', function (req, res) {
    res.sendFile('./public/offline.html');
});

//webpush.generateVAPIDKeys();
//azure key
const vapidKeys = {
    publicKey: 'BMwXXlYzG4-WUlHU2Pi4BkaaoJ3WawH53kSW05xuIZPtttW7MQ9zHpNod6a2Pt88N5JTZZU1DiLDmNEbOxeGXHQ',
    privateKey: 'G4C17rwBaSBMu0j9EyUUQT0JRQOQEbFetr9zbSgQ1og'
};

webpush.setVapidDetails(
    'mailto:pwa@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

router.get('/vapidPublicKey', function (req, res) {
    res.send(vapidKeys.publicKey);
});

router.post('/register', function (req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
});

router.post('/sendNotification', function (req, res) {
    const subscription = req.body.subscription;
    const payload = 'notification';
    const options = null;

    webpush.sendNotification(subscription, payload, options)
        .then(function () {
            res.sendStatus(201);
        })
        .catch(function (error) {
            res.sendStatus(500);
            console.log(error);
        });
});

module.exports = router;

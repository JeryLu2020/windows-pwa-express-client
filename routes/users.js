var express = require('express');
var router = express.Router();

const userServices  = require('../config/users-services');


router.post('/edit/:Id', userServices.update);

module.exports = router;

const { Hero, HeroActivityLog} = require('./database');

var ActivityLogdata = 'default';

exports.userProfile = (req, res) => {
    console.log('req.session.activityloguserId'+req.session.activityloguserId);
    if(req.session.userId){
        HeroActivityLog.findById(req.session.activityloguserId)
            .then(data=>{
                if(!data){
                    return res.render('error', { errmsg: 'no record' });
                }
                console.log('find ActivityLogdata success');
                ActivityLogdata = data.toString();
            })
            
        Hero.findById(req.session.userId)
            .then(data=>{
                if(!data){
                    return res.render('error', { errmsg: 'no record' });
                }
                console.log('findOne success222');

                return res.render('Users', { 
                    layout: 'layout', 
                    userprofiler : data,
                    activitylogdata : ActivityLogdata,
                });
            })
            .catch(err=>{
                if(err.kind === 'ObjectId'){
                    return res.render('error', { errmsg: err });
                }
                return res.render('error', { errmsg: err });
            });
    }
    else {
        res.render('error', { errmsg: "Please Login" });
    }
};

exports.update = (req, res) => {
    Hero.findByIdAndUpdate(req.params.Id, {
        state_name: req.body.state_name || 'N/A',
        first_name: req.body.first_name || 'Unknown name',
        middle_initial: req.body.middle_initial || 'N/A',
        last_name: req.body.last_name || 'N/A',
        street_address: req.body.street_address || 'N/A',
        city_name: req.body.city_name || 'N/A',
        payment_card: req.body.payment_card || 'N/A',
        day_of_birth: req.body.day_of_birth || '',
        
        username: req.body.username || 'Undefined',
        password: req.body.password || '',
        email: req.body.email || 'Undefined',
    }, {new: true})
    .then(data => {
        if(!data){
            return res.render('error', { errmsg: 'no record' });
        }
        // console.log(data._id);
        console.log('update success');
        return res.redirect('/users');
    })
    .catch(err=>{
        if(err.kind === 'ObjectId'){
            console.log('record not found' + req.params.Id);
            return res.render('error', { errmsg: err });
        }
        return res.render('error', { errmsg: err });
    });
};


exports.userregister = (req, res) => {
    
    // get infomation
    var logindatetime = Date().toString();
    var ip = req.headers['x-forwarded-for'] || req.ip;
    var os = req.headers['user-agent'];
    var number = 1;
    
    const heroactivitylog = new HeroActivityLog({
        username: req.body.username,
        password: req.body.password,
        loginDateTime : logindatetime,
        loginSuccess  : true,
        device_ip : ip,
        device_os  : os,
        loginnumber: number,
    })
    heroactivitylog.save()
        .then(data=>{
            console.log("loginactivity data" + data);
        })
        .catch(err=>{
            return res.render('error', { errmsg: "loginactivity failed to update" + err });
        })


    const hero = new Hero({
        first_name: req.body.first_name || 'Unknown name',
        middle_initial: req.body.middle_initial || 'N/A',
        last_name: req.body.last_name || 'N/A',
        street_address: req.body.street_address || 'N/A',
        city_name: req.body.city_name || 'N/A',
        payment_card: req.body.payment_card || 'N/A',
        state_name: req.body.state_name || 'N/A',
        day_of_birth: req.body.day_of_birth || '',
        
        username: req.body.username || 'Undefined',
        password: req.body.password || '',
        email: req.body.email || 'Undefined',
    });

    hero.save()
        .then(data=>{
            return res.redirect('/');
        })
        .catch(err =>{
            return res.render('error', { errmsg: err });
        })

};

exports.userlogin = (req, res) => {

    let loginname = req.body.username;
    let loginpassword = req.body.password;

    if(loginname=="admin" && loginpassword=="admin"){
        return res.render('error', { errmsg: "Please use another user name" });
    } else {
        // find activitylog id
        HeroActivityLog.findOne({ username: loginname, password: loginpassword})
            .then(data=>{
                if(!data){
                    return res.render('error', { errmsg: 'no record' });
                }
                req.session.activityloguserId = data._id;
                console.log("req.session.activityloguserId" + req.session.activityloguserId);
            })
            .catch(err=>{
                if(err.kind === 'ObjectId'){
                    return res.render('error', { errmsg: err });
                }
            });
        // find users id
        Hero.findOne({ username: loginname, password: loginpassword})
            .then(data=>{
                if(!data){
                    return res.render('error', { errmsg: 'no record' });
                }
                console.log('login success' + data._id);
                // let userProfiler = JSON.parse(JSON.stringify(data));
                // console.log("jsonobj:" + userProfiler[0]._id);
                req.session.userId = data._id;
                return res.redirect('/');
            })
            .catch(err=>{
                if(err.kind === 'ObjectId'){
                    return res.render('error', { errmsg: err });
                }
                return res.render('error', { errmsg: err });
            });
    }
}

exports.userlogout = (req, res) => {
    if (req.session) {
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
};

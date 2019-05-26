const Hero = require('./database');

exports.userProfile = (req, res) => {
    if(req.session.userId){
        Hero.findById(req.session.userId)
            .then(data=>{
                if(!data){
                    return res.render('error', { errmsg: 'no record' });
                }
                console.log('findOne success11' + data);
                console.log("data.heroactivitylog" + data.heroactivitylog);
                return res.render('Users', { 
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
        return res.render('error', { errmsg: err });
    });
};


exports.userregister = (req, res) => {
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

    // get infomation
    var logindatetime = Date().toString();
    var ip = req.headers['x-forwarded-for'] || req.ip; // x-forward-for is for proxy
    var os = req.headers['user-agent'];
    var number = 1;

    let loginname = req.body.username;
    let loginpassword = req.body.password;

    if(loginname=="admin" && loginpassword=="admin"){
        return res.render('error', { errmsg: "You are not allowed to login as admin" });
    } else {
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

                // insert the login activitiesy
                Hero.findOneAndUpdate(req.session.userId, { 
                    $addToSet: {
                        heroactivitylog: {
                            loginDateTime : logindatetime,
                            loginSuccess  : true,
                            device_ip : ip,
                            device_os  : os,
                            loginnumber: number++
                        }
                    },
                }, {new: true})
                    .then(data => {
                        if(!data){
                            return res.render('error', { errmsg: 'no record' });
                        }
                        console.log('update success');
                    })
                    .catch(err=>{
                        return res.render('error', { errmsg: err });
                    });

                // redirect to home page after success login
                return res.redirect('/');
            })
            .catch(err=>{
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



exports.checkName = (req, res) => {

    Hero.findOne({ username: req.body.username})
        .then(data=>{
            if(!data){
                return res.render('layout', { checkname : "username is valid"});
            }
            return res.render('layout', { checkname : "username already exist"});
        })
        .catch(err=>{
            return res.render('error', { errmsg: err });
        });

}
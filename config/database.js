//Import the mongoose module
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Set up default mongoose connection
var mongoDBurl = process.env.MONGODB_CONNECTION;
mongoose.connect(mongoDBurl, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', (callback) => {
    console.log('MongoDB connectted！！');
});

//create schema
const heroSchema = new Schema({

        first_name: String,
        middle_initial: String,
        last_name: String,

        street_address: String,
        company_address: String,

        country_name: String,
        state_name: String,
        city_name: String,
        
        day_of_birth: Date,
        driver_license_number: String,
        driver_license_state: String,
        payment_card: String,
        payment_card_id_number: String,
        payment_card_expiration_date: Date,

        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,  
        },
        email: {
            type: String,
            required: true,
        },
        emailValid: {
            type: Boolean,
            default: false
        },
        
        // user login activities
        heroactivitylog: [{
            loginDateTime : String,
            loginSuccess  : Boolean,
            device_ip : String,
            device_os  : String,
            loginnumber: {
                type: Number,
                default: 0,
            },
        }],

    },{ 
        timestamps: true,
    });


//create model
const Hero = mongoose.model('Hero', heroSchema, 'heros');
module.exports = Hero;
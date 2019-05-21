//Import the mongoose module
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Set up default mongoose connection
var mongoDBurl = 'mongodb://jerytest:IZ8nYAVROPoQL8kSalbtMwsAhBK8oKft7IdNMm6NFXHrPwinNVmxrGsmURfSD8N5yxFemsMRtIxX5DWG6epJ1A==@jerytest.documents.azure.com:10255/React?ssl=true&replicaSet=globaldb';
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
        name:String,
        message:String,
        first_name: String,
        middle_initial: String,
        last_name: String,
        street_address: String,
        city_name: String,
        state_name: String,
        country_name: String,
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
        email: String,
    },
    { timestamps: true }
);

//create model
const Hero = mongoose.model('Hero', heroSchema);
module.exports = Hero;
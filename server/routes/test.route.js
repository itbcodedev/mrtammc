const Gtfs = require('../models/gtfs')

// connect mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose_basics',{ useNewUrlParser: true }).catch(error => handleError(error));
const conn = mongoose.connection;
conn.on('connected', function() {
    console.log("connect to database")
})
conn.on('error', function () {
    console.log('Error database connection')
})

console.log(Gtfs)

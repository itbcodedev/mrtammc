var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    time : {type: String, require:true},
    station: {type: String, require:true},
    density: {type: String, require:true},
    create_on: {type: Date, require:true},
    ipaddr: {type: String, require:true}
});

module.exports = mongoose.model('Passenger',schema);

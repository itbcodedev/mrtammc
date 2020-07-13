var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    code : {type: String, require:true},
    name: {type: String, require:true},
    latitude: {type: String, require:true},
    longitude: {type: String, require:true},
    image: {type: String, require:true},
    icon: {type: String, require:true},
    capacity: {type: String, require:true},
});

module.exports = mongoose.model('Parking',schema);
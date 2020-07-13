var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    code : {type: String, require:true},
    name: {type: String, require:true},
    protocol: {type: String, require:true},
    host: {type: String, require:true},
    port: {type: String, require:true},
    username: {type: String, require:true},
    password: {type: String, require:true},
    latitude: {type: String, require:true},
    longitude: {type: String, require:true},
    description: {type: String, require:true},
});

module.exports = mongoose.model('Cctv',schema);
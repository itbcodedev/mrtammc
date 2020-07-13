var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    level : {type: String, require:true},
    color: {type: String, require:true},
    percent: {type: Number, require:true},
    
});

module.exports = mongoose.model('Ratioparking',schema);
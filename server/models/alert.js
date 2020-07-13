var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    type : {type: String, require:true},
    source: {type: String, require:true},
    ipaddr: {type: String, require:true},
    summary: {type: String, require:true},
    description: {type: String, require:true},
    status: {type: String, require:true},
    priority: {type: String, require:true},
    level: {type: String, require:true},
    create_on: {type: Date, require:true},
    owner_by: {type: String, require:true},
});

module.exports = mongoose.model('Alert',schema);

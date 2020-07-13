var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    email : {type: String, require:true},
    fullname: {type: String, require:true},
    role: {type: String, require:true},
    create_dt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LdapUser',schema);
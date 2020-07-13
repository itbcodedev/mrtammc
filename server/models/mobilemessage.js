var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    stop_group : {type: String, require:true},
    stop_id: {type: String, require:true},
    title_line: {type: String, require:true},
    title_line_en: {type: String},
    notify_date: {type: String, require:true},
    message: {type: String, require:true},
    message_en: {type: String},
    user_name: {type: String, require:true},
});

module.exports = mongoose.model('MobileMessage',schema);

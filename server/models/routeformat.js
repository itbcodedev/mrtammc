var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    route : {type: String, require:true},
    color: {type: String, require:true},
    station_icon: {type: String, require:true},
    train_icon: {type: String, require:true}
});

module.exports = mongoose.model('Routeformat',schema);
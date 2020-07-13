var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    route_id: {type: String, require:true},
    color: {type: String, require:true},
    iconstationname: {type: String},
    iconstationpath: {type: String, require:true},
    icontrainname: {type: String, require:true},
    icontrainpath: {type: String}
});

module.exports = mongoose.model('RouteFormat',schema);

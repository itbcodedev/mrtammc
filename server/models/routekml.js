var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    route : {type: String, require:true},
    kml_path: {type: String, require:true},
    geojson_path: {type: String, require:true},
    shapefile_path: {type: String, require:true}
});

module.exports = mongoose.model('Routekml',schema);
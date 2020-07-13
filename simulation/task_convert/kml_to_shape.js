const path = require('path')
var fs = require("fs");
const  KmlToShape = require('../../server/process/kml_to_shape')


const kml = new KmlToShape
const FILE = path.join(__dirname, 'purple_gold.kml')
const OUTPUT = path.join(__dirname, 'shapes.txt')
const OUTPUTGEOJSON = path.join(__dirname, 'geojson.json')
//kml.generate_shapesfile(FILE,OUTPUT)
// kml.generate_geojson(FILE,OUTPUTGEOJSON)
// generate one part of geojson
// const geojson = kml.getCoordinatesGeoJson(13.995904,100.413142,13.967653,100.453196,10)
// console.log(geojson)

// fs.writeFile("temp.geojson", JSON.stringify(geojson, null, 2), (err) => {
//     if (err) console.log(err);
//     console.log("Successfully Written to File.");
// });

const geojson  = kml.generate_geojson(FILE,OUTPUTGEOJSON)


fs.writeFile("temp.geojson", JSON.stringify(geojson, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});
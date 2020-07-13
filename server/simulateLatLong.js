var fs = require("fs");
const LatLong = require('../server/process/LatLong')

const latlng = new LatLong

const pathlength = latlng.getPathLength(13.995904,100.413142,13.967653,100.453196)
console.log(pathlength)

const geojson = latlng.getCoordinatesGeoJson(13.995904,100.413142,13.967653,100.453196,10)
console.log(geojson)

fs.writeFile("temp.geojson", JSON.stringify(geojson, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});
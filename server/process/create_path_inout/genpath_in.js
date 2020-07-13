var fs = require('fs');
const file = './geojsonpath5m/bl_south_bl1_bl38.geojson'
let rawdata = fs.readFileSync(file, 'utf8')
let geojson = JSON.parse(rawdata);

const source = {}
source.path = {
    "name": geojson.name,
    "direction": "in"
}
source.points = []
geojson.features.map( (feature,index)  => {
    // console.log(feature.geometry.coordinates)
    let lat = feature.geometry.coordinates[1]
    let lng = feature.geometry.coordinates[0]

    let obj = { }
    obj.index = index 
    obj.latitude = lat 
    obj.longitude = lng
    
    source.points.push(obj)
})

fs.writeFile(`${geojson.name}_in.json`, JSON.stringify(source, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.", `${geojson.name}_in.json`);
});

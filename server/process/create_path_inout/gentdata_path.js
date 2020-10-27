var fs = require('fs');
const file = './geojsonpath10m/BL38-BL37.geojson'
let rawdata = fs.readFileSync(file, 'utf8')
let geojson = JSON.parse(rawdata);

const source = {}
source.path = {
    "name": geojson.name,
    "direction": "out"
}
source.points = []
geojson.features.reverse().map( (feature,index)  => {
    // console.log(feature.geometry.coordinates)
    let lat = feature.geometry.coordinates[1]
    let lng = feature.geometry.coordinates[0]

    let obj = { }
    // obj.index = index 
    obj.latitude = lat 
    obj.longitude = lng
    
    source.points.push(obj)
})



fs.writeFile(`./geojsonpath10m/${geojson.name}_data.json`, JSON.stringify(source, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.", `./geojsonpath10m/${geojson.name}_out.json`);
});

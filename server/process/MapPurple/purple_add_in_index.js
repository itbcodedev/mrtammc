var fs = require('fs');
const file = './geojsonpath10m_json/purple_data_in.json'
let rawdata = fs.readFileSync(file, 'utf8')
let geojson = JSON.parse(rawdata);


geojson.points.forEach((element,index) => {
    element.index = index
});

fs.writeFile(`purple_in_index.json`, JSON.stringify(geojson, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.", `purple_in_index.json`);
});

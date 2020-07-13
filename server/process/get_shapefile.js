const path = require('path')
var fs = require("fs");
const  KmlToShape = require('./kml_to_shape')


const kml = new KmlToShape
const FILE = path.join(__dirname, 'BL_south_BL10_BL38.kml')
const OUTPUT = path.join(__dirname, 'shapes.txt')

const shapes = kml.generate_shapesfile(FILE)
let filename = 'BL_south_BL10_BL38.kml'.split(".")[0]

fs.writeFile(`${filename}_shapes.txt`, shapes, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});
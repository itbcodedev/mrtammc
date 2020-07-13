const path = require('path')
var fs = require("fs");
const  KmlToShape = require('./kml_to_shape')


const kml = new KmlToShape
const FILE = path.join(__dirname, 'BL_south_BL10_BL38.kml')
const OUTPUT = path.join(__dirname, 'shapes.txt')

const args = process.argv.slice(2)
console.log(args[0])


const pathinout = kml.generate_path_out(FILE)
let filename = 'BL_south_BL10_BL38.kml'.split(".")[0]

fs.writeFile(`${filename}_out.txt`, JSON.stringify(pathinout, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});
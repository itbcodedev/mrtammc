const _ = require('lodash')
const fs = require('fs')
const csv = require('fast-csv');
const path = require('path')
const os = require('os');
const xmlReader = require('read-xml');

const convert = require('xml-js');
const request = require('request');
const readline = require('readline');

// output file in the same folder
const outputcsv = path.join(__dirname, 'output.csv');
const output = []; // holds all rows of data
output.push("shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled")



function generate_shapes(filename) {
  const FILE = path.join(__dirname, `${filename}`);
  const newObj = []

  const xml = require('fs').readFileSync(FILE, 'utf8');
  const result = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));

  const Placemark = result.kml.Document.Placemark
  console.log(Placemark)
  const name = result.kml.Document.name._text
  console.log(name)

  // remove space replace(/\s/g, '')
  const cords = Placemark.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
  // a new array for each row of data
  cords.forEach((cord, index) => {
    const row = [];
    cord_arr = cord.split("/")
    // console.log("longitude", cord_arr[0])
    // console.log("latitude", cord_arr[1])
    row.push(name)
    row.push(cord_arr[1])
    row.push(cord_arr[0])
    row.push(index)
    output.push(row.join()); // by default, join() uses a ','
  });

  console.log(output)
  fs.writeFileSync(`${outputcsv}_${name}.csv`, output.join(os.EOL));




}

generate_shapes('purple_gold.kml')





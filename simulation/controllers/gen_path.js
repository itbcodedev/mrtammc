const _ = require('lodash')
const fs = require('fs'),
      path = require('path'),
      xmlReader = require('read-xml');

const convert = require('xml-js');
const request = require('request');
const readline = require('readline');
// If your file is located in a different directory than this javascript
// file, just change the directory path.
function generate_paths(filename, direction) {
  const FILE = path.join(__dirname, `../path/${filename}`);
  const newObj = []
  xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
      if (err) {
          console.error(err);
      }

      var xml = data.content;
      var result = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 4}));
      const Placemark = result.kml.Document.Folder.Placemark
      const name = result.kml.Document.Folder.name
      console.log(name._text)
      const object = {}
      const path = {}
      const array = []
      path['name'] = name._text

      if (direction == 'in') {
        path['direction'] = direction
        object['path'] = path
        Placemark.forEach( (p,i) => {
          coordinates = p.Point.coordinates._text.split(",")
          const latitude =  coordinates[1]
          const longitude = coordinates[0].replace(/\r?\n?/g, '').trim()
          const point = {}
          point['index'] = i
          point['latitude'] = latitude
          point['longitude'] = longitude

          array.push(point)
        })
        object['points'] = array
        // console.log(_.first(object.points))
        // console.log(_.last(object.points))
        fs.writeFileSync(`../output/${name._text}_${direction}.json`, JSON.stringify(object, null, 2));
        logProgress(`sPaths written successfully to ${name._text}-${direction}.json`);

      }

      if (direction == 'out') {
        path['direction'] = direction
        object['path'] = path
        Placemark.reverse().forEach( (p,i) => {
          coordinates = p.Point.coordinates._text.split(",")
          const latitude =  coordinates[1]
          const longitude = coordinates[0].replace(/\r?\n?/g, '').trim()
          const point = {}
          point['index'] = i
          point['latitude'] = latitude
          point['longitude'] = longitude

          array.push(point)
        })
        object['points'] = array
        // console.log(_.first(object.points))
        // console.log(_.last(object.points))
        fs.writeFileSync(`../output/${name._text}_${direction}.json`, JSON.stringify(object, null, 2));
        logProgress(`sPaths written successfully to ${name._text}-${direction}.json`);

      }

      process.stdout.write('\n');
  });
}

function logProgress(str) {
  // A little bit of readline magic to not fill the screen with progress messages.
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  process.stdout.write(str);
}

//convert kml --> json file



generate_paths('parted_blue_chalearm.kml','in')
generate_paths('parted_blue_chalearm.kml','out')


generate_paths('purple_1.kml','in')
generate_paths('purple_1.kml','out')

generate_paths('purple_2.kml','in')
generate_paths('purple_2.kml','out')

generate_paths('purple_3.kml','in')
generate_paths('purple_3.kml','out')

generate_paths('purple_4.kml','in')
generate_paths('purple_4.kml','out')

generate_paths('purple_5.kml','in')
generate_paths('purple_5.kml','out')

generate_paths('purple_6.kml','in')
generate_paths('purple_6.kml','out')

generate_paths('purple_7.kml','in')
generate_paths('purple_7.kml','out')

generate_paths('purple_8.kml','in')
generate_paths('purple_8.kml','out')
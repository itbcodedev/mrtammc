const fs = require('fs'),
    path = require('path'),
    xmlReader = require('read-xml');

const convert = require('xml-js');
const request = require('request');

// If your file is located in a different directory than this javascript
// file, just change the directory path.
const FILE = path.join(__dirname, './simulate_purpleline.kml');
const newObj = []
xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
    if (err) {
        console.error(err);
    }

    var xml = data.content;
    var result = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 4}));

    const Placemark = result.kml.Document.Folder.Placemark.reverse()

    Placemark.forEach( p => {
        //console.log(p)
        //console.log(p.name._text)
        //console.log(p.Point.coordinates._text)
        coordinates = p.Point.coordinates._text.split(",")
        // 100.5304975,13.7321115,0
        //var longitude = coordinates[0];
        //var latitude = coordinates[1].replace(/[^\x20-\x7E]/gmi, "");
        //console.log("lat/long: " + latitude + ", " + longitude);
        // const obj = { name: p.name._text,
        //               latitude: coordinates[1],
        //               longitude: coordinates[0].replace(/\r?\n?/g, '').trim()
        //             }
        const date = new Date()
        const time = date.getDate()
        const tripEntity = "0007-out"
        const latitude =  coordinates[1]
        const longitude = coordinates[0].replace(/\r?\n?/g, '').trim()
        const tripId = "0007-out"
        const gtfsrt = `
      {
        "header": {
            "gtfs_realtime_version": "2.0",
            "incrementality": "FULL_DATASET",
            "timestamp": "${time}",
            "route_name": "purple",
            "headsign": "PP01-คลองไผ่ to PP16-เตาปูน",
            "tripEntity": "${tripEntity}"
        },
        "entity": {
            "id": "${tripEntity}",
            "vehicle": {
            "trip": {
              "trip_id": "${tripId}"
            },
                "position": {
                    "latitude": "${latitude}",
                    "longitude": "${longitude}"
                }
            }
        }
      }
      `

        newObj.push(JSON.parse(gtfsrt))

    })

});


//console.log(JSON.stringify(newObj))

// console.log(newObj)

function makeRequest() {
    newObj.forEach( (obj, index) => {
        //console.log(obj)
        setTimeout(function () {
            request({
                url: "http://mmc_app1.mrta.co.th/api/v2/simulate",
                //url: "http://localhost:3000/api/v2/simulate_realtime",
                method: "POST",
                json: true,
                body: obj
            }, function (error, response, body){
                console.log(response);
            });

        }, 1000 * (index + 1))

    })
}

makeRequest();

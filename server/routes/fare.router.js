'use strict';

const xml2js = require('xml2js');
const parser = require('xml2js').Parser(xml2js.defaults["0.2"]);
const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
var convert = require('xml-js');
const encoding = require('encoding');
const utf8 = require('utf8');
const JSONToCSV = require("json2csv").parse;

const express = require('express');
const router = express.Router();

router.get('/bystation', function(req, res, next) {
  let query = req.query;
  query.TypeTk = 'C'
  query.TypePs = 'N'
  query.TypeDt = 'N'
  query.AccessKey = 'x8mkM2TDQW.6ofNJG09Qf.5xqnJIFNRn=='
  //query.from_stn = '35'
  //query.to_stn = '36'
  let postData = Object.keys(query).map(key => key + '=' + query[key]).join('&')
  //console.log(postData);
  const params = {
    host: 'bds.mrta.co.th',
    port: '80',
    method: 'POST',
    path: '/BDS/service/SvcFare.asmx/GetFare',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  getStation(params, postData)
    .then(values => {
      res.json(values);
    })
    .catch(values => {
      console.log('fail catch');
      res.json(values);
    })

})

router.get('/search', function(req, res, next) {
  let query = req.query;
  console.log(query);
  query.AccessKey = 'x8mkM2TDQW.6ofNJG09Qf.5xqnJIFNRn=='
  let postData = Object.keys(query).map(key => key + '=' + query[key]).join('&')
  //console.log(postData);
  const params = {
    host: 'bds.mrta.co.th',
    port: '80',
    method: 'POST',
    path: '/BDS/service/SvcFare.asmx/GetFare',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }
  getFare(params, postData)
    .then(values => {
      res.json(values);
    })
    .catch(values => {
      console.log('fail catch');
      res.json(values);
    })
});

// post to mrta
function getFare(params, postData) {

  console.log(params);
  return new Promise((resolve, reject) => {
    let req = http.request(params, function(res) {
      res.setEncoding('utf8');
      // reject on bad status
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      // cumulate data
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      // resolve on end
      res.on('end', function() {
        // console.log(result);

        parser.parseString(body, (err, result) => {
          if (err) {
            reject('error2' + err);
          } else {
            const fare = result.DataTable['diffgr:diffgram'][0].NewDataSet[0].Table2;
            const content = JSON.stringify(fare)
            console.log(content)
            let abc = fare.map((array) => {
              let keys = Object.keys(array)
              let object = {}
              keys.forEach((key) => {
                object[key] = array[key][0]
              })
              return object
            })
            resolve(abc);
          };
        });
      });

    });
    // reject on request error
    req.on('error', function(err) {
      // This is not a "Second reject", just a different sort of failure
      reject(err);
    });
    if (postData) {
      req.write(postData);
    }
    // IMPORTANT
    req.end();
  });
}

//utility function
function serialize_postData(str) {
  var result = {};
  str.split('&').forEach(function(x) {
    var arr = x.split('=');
    arr[1] && (result[arr[0]] = arr[1]);
  });
  return result
}

function sortobjbykey(obj,from_stn ,to_stn){
  let ordered = {}

  Object.keys(obj).sort((a,b)=>{
    let station_a = +a.split('-')[1]
    let station_b = +b.split('-')[1]


    if (from_stn < to_stn) {
      if (station_a < station_b) {
        return -1
      }
      if (station_a > station_b) {
        return 1
      }
  
    } else {
      if (station_a < station_b) {
        return 1
      }
      if (station_a > station_b) {
        return -1
      }
    }


    //equal
    return 0
  }).forEach( (key) => {
    if (key.split('-')[1] !== undefined) {
  
        let newkey = key.split('-')[1] + "-" + key.split('-')[2]
        ordered[newkey] = obj[key]


    }
  })
  return ordered
}


function filterstation(sortedobj, from_stn ,to_stn) {
  let ordered = {}

  Object.keys(sortedobj).map((oldkey) => {
    let newkey = oldkey.split('-')[1] + "-" + oldkey.split('-')[2]
    ordered[newkey] = sortedobj[oldkey]
  })

  console.log(ordered);

  if (from_stn < to_stn) {
    console.log('หัวลำโพง  >>>>>>>>>>>>> คลองบางไผ่')
    console.log(sortedobj)

  } else {
    console.log('คลองบางไผ่  >>>>>>>>>>>>> หัวลำโพง')
    console.log(sortedobj)

  }

}

// post to mrta
function getStation(params, postData) {

  console.log(params);
  console.log(postData);
  let from_stn = serialize_postData(postData).from_stn
  let to_stn = serialize_postData(postData).to_stn

  return new Promise((resolve, reject) => {
    let req = http.request(params, function(res) {
      res.setEncoding('utf8');
      // reject on bad status
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      // cumulate data
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      // resolve on end
      res.on('end', function() {
        // console.log(result);

        parser.parseString(body, (err, result) => {
          if (err) {
            reject('error2' + err);
          } else {
            const fare = result.DataTable['diffgr:diffgram'][0].NewDataSet[0].Table2;
            const content = JSON.stringify(fare)
            //console.log(content)
            let allfare = fare.map((array) => {
              let keys = Object.keys(array)
              let object = {}
              keys.forEach((key) => {
                object[key] = array[key][0]
              })
              return object
            })

            let found = allfare.find((record) => {
                return record.StnID == from_stn
            })

            let sortedobj = sortobjbykey(found, +from_stn, +to_stn);
            // filterstation(sortedobj, from_stn, to_stn);
            let message = { 
              trip: from_stn + " to " + to_stn,
              stations: sortedobj
            }
            resolve(message);
          };
        });
      });

    });
    // reject on request error
    req.on('error', function(err) {
      // This is not a "Second reject", just a different sort of failure
      reject(err);
    });
    if (postData) {
      req.write(postData);
    }
    // IMPORTANT
    req.end();
  });
}
module.exports = router;

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;
const https = require('https');

// https://bds.mrta.co.th/BDS/service/SvcPRt.asmx?op=GetParkRT


// AccessKey : x8mkM2TDQW.6ofNJG09Qf.5xqnJIFNRn==

function getParkRt(){
  console.log("getParkRt called")
  return new Promise((resolve,reject)=>{
    
    https.get('https://bds.mrta.co.th/BDS/service/SvcPRt.asmx/GetParkRT?AccessKey=x8mkM2TDQW.6ofNJG09Qf.5xqnJIFNRn==',  (resp) => {
      let rawdata = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        rawdata += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        // console.log(data);
        parseString(rawdata, (err, result) => {
          // array of parkingInfo
          if (result !== undefined) {
            const parkingInfo = result.DataTable['diffgr:diffgram'][0]['NewDataSet'][0]['Table'];
            resolve(parkingInfo);
          } else {
            reject( 'Got error: Can not connect Database parking');
          }

        });
      });
    }) // http.get
  });
}

router.get('/all', function(req, res, next) {
  getParkRt().then( values => {
    const today = new Date();
    proxy = [];
    values.forEach( value => {
      data = {
              code: value.Code[0],
               name: value.Name[0],
               projname: value.ProjName[0],
               ncarrem: value.nCarRem[0],
               date: today.getDate()+"-"+today.getMonth()+"-"+today.getFullYear(),
               time: (today.getHours())+":"+(today.getMinutes())
             }
      proxy.push(data)
    });
    res.json(proxy);

  })
  .catch( error => {
    console.log(error);
  })
});

router.get('/test' , (req, res) => {
  res.send('<h1>Hello Fucking World</h1>');
  res.end()
})
module.exports = router;

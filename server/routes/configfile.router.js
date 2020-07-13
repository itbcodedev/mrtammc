const express = require("express");
const csvjson = require('csvjson');
const router = express.Router();
const fs = require('fs');
const multer = require("multer");
const loadConfigfile = require('../configfile');
const now = new Date();
let filename = "";


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mmcmrtadb',{ useNewUrlParser: true }).catch(error => handleError(error));
const conn = mongoose.connection;
conn.on('connected', function() {
    console.log("connect to database")
})
conn.on('error', function () {
    console.log('Error database connection')
})

const GTFS = require('../models/gtfs')

const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "configfiles/");
  },
  filename: (req, file, cb) => {
    filename = file.originalname;
    cb(
      null,
      now
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "") +
      "-" +
      file.originalname
    );
  }
});

// Accept a single file with the name fieldname
var upload = multer({
  storage: store
});

router.post("/:filename", (req, res, next) => {
  let filename = req.params.filename;
  let singlefile = upload.single(filename);
  singlefile(req, res, error => {
    if (error) {
      res.status(501).json({
        error: "upload error"
      });
    } else {
      console.log('The filename is ' + res.req.file.filename);
      const reply = {
        message: 'success',
        path: 'configfiles/',
        origin: filename,
        filename: res.req.file.filename
      }
      console.log(reply);
      res.send(reply)
    }
  });
});

router.get("/view/:filename", async (req, res) => {
  let filename = req.params.filename;
  console.log(filename);
  const jsonfile = await loadConfigfile(filename);
  console.log(jsonfile)
  res.json(jsonfile);
});

router.get("/deployconfig/:filename", (req, res) => {
  console.log("deploy move file from configfiles --> feed + backupfeed")
  let filename = req.params.filename;
  let oldfile = "configfiles/" + filename;
  let targetfile = "feed/" + filename.split('-')[1];
  let backupfile = "backupfeed/" + filename.split('-')[1];

  // backup file first
  fs.rename(targetfile, backupfile, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(err);
      }
    } else {
      res.json({
        message: "Backup Success"
      });
    }
  });

  // copy note rename
  fs.copyFileSync(oldfile, targetfile, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(err);
      }
    } else {
      res.json({
        message: "Success Deploy"
      });
    }
  });
});


router.get("/delete/:filename", (req, res) => {
  let filename = req.params.filename;

  let fullpath = './configfiles/' + filename
  console.log("delete file:")
  console.log(fullpath);
  // fs.readdir('.', function(err, files) {
  //  console.log(files);
  //});

  fs.unlink(fullpath, (err) => {
    if (err) {
      res.json({
        message: "File cannot access"
      })
    } else {
      res.json({
        message: "File Access"
      })
    }
  })


});

router.get("/savedb/:filename", (req, res) => {
  console.log("save to database move file  ./configfiles/  -> database")
  let filename = req.params.filename;
  const csvFilePath = `./configfiles/${filename}`
  
  const name = filename.split('-')[1].split('.')[0];
  const csv = require('csvtojson');
  // read csv
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      if (jsonObj && jsonObj.length) {
        const model = GTFS.find(o => o.filenameBase == name).model
        model.collection.remove()
        console.log(jsonObj)
        model.insertMany(jsonObj)
      } else {
        console.log('blank db')
        res.send({
          message: 'fail insert  db because there is no record in file',
          error: 1
        });
      }

    });
});

router.post("/liveupdate/:filename", (req, res) => {
  let filename = req.params.filename;
  let data = JSON.stringify(req.body,null,2);
  
  console.log(data)
  const csvData = csvjson.toCSV(data, {
    headers: 'key'
  });
  fs.writeFileSync("./configfiles/" + filename, csvData, (err) => {
    if (err) {
      throw err
    } else {
      console.log(`Saved! ${filename} `);
    }
  });

  res.send({
    message: 'Live update..' + filename,
    error: 0
  });
});

module.exports = router;

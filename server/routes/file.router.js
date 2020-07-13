var express = require('express');
var router = express.Router();
const multer = require('multer');

const now = new Date();
const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, now.toISOString().slice(0,10).replace(/-/g,"") + '-' + file.originalname)
  }
});

var upload  = multer({storage: store});

router.post('/', upload.array("uploads[]", 20), (req, res, next) => {
  console.log("Uploaded file: ", req.files);
  res.send('Successfully uploaded!');
});

module.exports = router;

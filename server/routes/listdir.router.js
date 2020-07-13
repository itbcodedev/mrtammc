const express = require('express');
const router = express.Router();
const fs = require('fs')

router.get('/:path', function(req,res,next) {
    let path = req.params.path;
    console.log(__filename+ path);
    let files = fs.readdirSync(path);
    console.log(files);
    res.status(200).json(files);
});


module.exports = router;

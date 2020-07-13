var express = require('express');
var multer = require('multer')
var Routeformat = require('../models/routeformat')
var router = express.Router()
var upload = multer({ dest: 'tempuploads/' })
var path = require('path')
var fs = require('fs')


router.get('/', async (req, res) => {
    try {
        const routeformats = await Routeformat.find();
        res.status(200).json(routeformats)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log('remote routeformat id....' + id)
        const query = await Routeformat.findByIdAndRemove(id)
        console.log(query)
        res.status(200).json(query)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.put('/:id', async (req, res) => {
    console.log('update routeformat id....' + req.params.id)
    try {
        let routeformat = await Routeformat.findById(req.params.id)
        routeformat.set(req.body)
        let result = await routeformat.save()
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ message: error })
    }
})
router.post('/create', upload.any(), (req, res, next) => {
    let rootPath = path.join(__dirname, '../');
    let station_path = ""
    let train_path  = ""

    if (req.files) {
        req.files.forEach((file) => {
            console.log(file)   // tempuploads/8a912a19bbd4d4a67579b38efdaea1af
            console.log(rootPath) //60 /home/mee/AngularProj/mrtammcproj/server/
            var filename = (new Date).valueOf() + "-" + file.originalname
            fs.rename(rootPath + file.path, rootPath +'upload/images/' + filename, (err) => {
                if (err) throw err;
                
            })
            fs.copyFile(rootPath +'upload/images/' + filename, rootPath +'backupimages/' + filename, (err) => {
                if (err) throw err;
                
            })
            
            if (file.fieldname == "station_icon") {
                station_path = '/assets/dist/public/images/' + filename
            }
            
            if (file.fieldname == "train_icon") {
                train_path = '/assets/dist/public/images/' + filename
            }
        })
    }

    const routeformat = new Routeformat({
        route: req.body.route,
        color: req.body.color,
        station_icon: station_path,
        train_icon: train_path,

    })

    //console.log(req)
    const routeformatsave = routeformat.save()
        .then((obj) => {
            res.status(200).json(obj);
        })
        .catch((err) => {
            res.status(500).json({ message: err })
        })



});

module.exports = router
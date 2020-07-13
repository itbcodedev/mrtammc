var express = require('express');
var multer = require('multer')
var Kmltoroute = require('../models/kmltoroute')
var KmlToShape = require('../process/kml_to_shape')
var router = express.Router()
var upload = multer({ dest: 'tempuploads/' })
var path = require('path')
var fs = require('fs')


router.get('/', async (req, res) => {
    try {
        const kmltoroutes = await Kmltoroute.find();
        res.status(200).json(kmltoroutes)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log('remote routeformat id....' + id)
        const query = await Kmltoroute.findByIdAndRemove(id)
        console.log(query)
        res.status(200).json(query)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.put('/:id', async (req, res) => {
    console.log('update routeformat id....' + req.params.id)
    try {
        let kmltoroute = await Kmltoroute.findById(req.params.id)
        kmltoroute.set(req.body)
        let result = await kmltoroute.save()
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

// create folder upload/kmls
router.post('/create', upload.any(), (req, res, next) => {
    console.log("47", req.body)
    const kml = new KmlToShape

    let rootPath = path.join(__dirname, '../');
    let kml_path = ""
    let geojsonpoint_path = ""
    let geojsonline_path = ""

    if (req.files) {
        req.files.forEach((file) => {
            console.log(file)
            var filename = (new Date).valueOf() + "-" + file.originalname
            console.log(file.path) // tempuploads/8a912a19bbd4d4a67579b38efdaea1af
            console.log("60",rootPath) //60 /home/mee/AngularProj/mrtammcproj/server/
            fs.rename(rootPath + file.path, rootPath + 'upload/kmls/' + filename, (err) => {
                if (err) throw err;

            })
            fs.copyFile(rootPath + 'upload/kmls/' + filename, rootPath + 'backupkmls/' + filename, (err) => {
                if (err) throw err;

            })

            if (file.fieldname == "kml_file") {
                kml_path = '/assets/dist/public/kmls/' + filename
            }

            let kmlorig = rootPath + '/upload/kmls/' + filename


            // convert to geojson point

            try {
                let geojsonpoint = kml.generate_geojson(kmlorig)
                let filename_point = filename.split(".")[0]
                fs.writeFileSync(`${rootPath}/upload/kmls/${filename_point}_point.geojson`, JSON.stringify(geojsonpoint, null, 2))
                geojsonpoint_path = `/assets/dist/public/kmls/${filename_point}_point.geojson`
                console.log("85",geojsonpoint_path)
            } catch (err) {
                console.log(err)
            }

            // convert to geojson line 

            try {
                let geojsonline = kml.generate_geojsonLine(kmlorig)
                let filename_line = filename.split(".")[0]
                fs.writeFileSync(`${rootPath}/upload/kmls/${filename_line}_line.geojson`, JSON.stringify(geojsonline, null, 2))
                geojsonline_path = `/assets/dist/public/kmls/${filename_line}_line.geojson`  
                console.log("97",geojsonline_path)         
            } catch (err) {
                console.log(err)
            }


        })
    }
    console.log("105", "save kmltoroute")
    const kmltoroute = new Kmltoroute({
        route_th: req.body.route_th,
        route_en: req.body.route_en,
        color: req.body.color,
        kml_file: kml_path,
        geojsonline_file: geojsonline_path,
        geojsonpoint_file: geojsonpoint_path

    })

    //console.log(req)
    const kmltoroutesave = kmltoroute.save()
        .then((obj) => {
            res.status(200).json(obj);
        })
        .catch((err) => {
            res.status(500).json({ message: err })
        })



});

module.exports = router
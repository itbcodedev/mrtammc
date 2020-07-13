var fs = require('fs')
const os = require('os');
const express = require('express');
const router = express.Router();
var multer = require('multer')
var upload = multer({ dest: 'tempuploads/' })

var Routekml = require('../models/routekml')
const path = require('path')
const KmlToShape = require('../process/kml_to_shape')

router.get('/', async (req, res) => {
    try {
        const routekml = await Routekml.find();
        res.status(200).json(routekml)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log('remote routeformat id....' + id)
        const query = await Routekml.findByIdAndRemove(id)
        console.log(query)
        res.status(200).json(query)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.post('/genshapesfile', upload.any(), (req, res, next) => {

    let kml_path = ""
    let geojson_path = ""
    let filename = ""
    if (req.files) {
        req.files.forEach((file) => {
            console.log(file)
            filename = (new Date).valueOf() + "-" + file.originalname
            fs.rename(file.path, 'upload/files/' + filename, (err) => {
                if (err) throw err;
                console.log(file.path)
            })

            kml_path = '/assets/dist/public/files/' + filename

        })
    }


    const kml = new KmlToShape
    const File = path.join(__dirname, `../upload/files/${filename}`)

    const geojson = kml.generate_geojson(File)

    geojson_path = path.join(__dirname, `../upload/files/${filename}.geojson`)
    fs.writeFile(geojson_path , JSON.stringify(geojson, null, 2), (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File geojson.");
    });

    const shapesfile = kml.generate_shapesfile(File)

    shapefile_path = path.join(__dirname, `../upload/files/${filename}.shapes.txt`)
    fs.writeFile(shapefile_path, shapesfile, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File. shapes.txt");
    });


    const routekml = new Routekml({
        route: req.body.route,
        kml_path: kml_path,
        geojson_path: geojson_path,
        shapefile_path: shapefile_path

    })

    const routekmlsave = routekml.save()
        .then((obj) => {
            res.status(200).json(obj);
        })
        .catch((err) => {
            res.status(500).json({ message: err })
        })

});

module.exports = router;
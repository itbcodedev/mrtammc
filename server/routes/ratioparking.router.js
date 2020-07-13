var express = require('express');
var Ratioparking = require('../models/ratioparking')
var router = express.Router()



router.get('/', async (req, res) => {
    try {
        const ratioparkings = await Ratioparking.find();
        res.status(200).json(ratioparkings)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log('remote routeformat id....' + id)
        const query = await Ratioparking.findByIdAndRemove(id)
        console.log(query)
        res.status(200).json(query)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.put('/:id', async (req, res) => {
    console.log('update routeformat id....' + req.params.id)
    try {
        let ratioparking = await Ratioparking.findById(req.params.id)
        ratioparking.set(req.body)
        let result = await ratioparking.save()
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ message: error })
    }
})
router.post('/create', (req, res, next) => {


    const ratioparking = new Ratioparking({
        level: req.body.level,
        color: req.body.color,
        percent: req.body.percent,

    })

    //console.log(req)
    const ratioparkingsave = ratioparking.save()
        .then((obj) => {
            res.status(200).json(obj);
        })
        .catch((err) => {
            res.status(500).json({ message: err })
        })



});

module.exports = router
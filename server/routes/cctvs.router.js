var express = require('express');
var router = express.Router();
var Cctv = require('../models/cctv')
const cctv = require('../process/cctv_process')

router.get('/', async (req, res) => {
    try {
        const cctvs = await Cctv.find();
        res.status(200).json(cctvs)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.get('/delete/:cctv_id', async (req, res) => {
    try 
    {
        const removecctv = await Cctv.remove({ _id: req.params.cctv_id});
        res.status(200).json(removecctv)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.delete('/:id', async (req, res) => {
    console.log('remote CCTV id....' + req.params.id)
    try 
    {
        
        const query = await Cctv.findByIdAndRemove(req.params.id)
        console.log(query)
        res.status(200).json(query)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.get('/:cctv_id', async (req, res) => {
    try 
    {
        const cctv = await Cctv.findById(req.params.cctv_id)
        res.status(200).json(cctv)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.put('/:id', async (req, res) => {
    console.log('update parking id....' + req.params.id)
    try {
        let routeformat = await Cctv.findById(req.params.id)
        routeformat.set(req.body)
        let result = await routeformat.save()
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.patch('/update/:cctv_id', async (req, res) => {
    try 
    {
        const updateObject = req.body;
        const updatecctv = await Cctv.updateOne(
            { _id: req.params.cctv_id},
            { $set: updateObject});
        res.status(200).json(updatecctv)
    } catch (error) {
        res.status(500).json({message: error})
    }
})
router.post('/create', async (req, res, next) => {
    const cctv = new Cctv({
        code: req.body.code,
        name: req.body.name,
        protocol: req.body.protocol,
        host: req.body.host,
        port: req.body.port,
        username: req.body.username,
        password: req.body.password,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        description: req.body.description
    })

    try {
        const cctvsave = await cctv.save();
        res.status(200).json(cctvsave);
    } catch (error) {
        res.status(500).json({ message: error})
    }
    
})

router.get('/server/status', async (req, res) => {
    
    try 
    {
        const cctv1 = new cctv('sawangpong@192.168.3.48','cctv') 
        const status = await cctv1.getStatus();
        res.status(200).json(status)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.get('/server/restart', async (req, res) => {
    
    try 
    {
        const cctv1 = new cctv('sawangpong@192.168.3.48','cctv') 
        const status = await cctv1.restart();
        res.status(200).json(status)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

module.exports = router









    
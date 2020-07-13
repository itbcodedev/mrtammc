const express = require('express');
const router = express.Router();

//1 Models are defined using the Schema interface
const mongoose = require('mongoose');

//2 Define a schema
const Schema = mongoose.Schema;

const kmlSchema = new Schema({
  line_en: { type: String, required: true, unique: true },
  line_th: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  status: { type: String, required: true}
  },{
    timestamps: true
});

// timestamps obtion
//     "createdAt": "2019-05-14T01:29:20.234Z",
//     "updatedAt": "2019-05-14T01:29:20.234Z",

// the schema is useless so far
// 4 we need to create a model using it
const KmlModel = mongoose.model('Kml', kmlSchema);

router.get('/', async (req,res)=>{
  try {
      const result = await KmlModel.find().exec();
      res.send(result);
  } catch (error) {
      res.status(500).send(error);
  }
})

router.get('/:kmlId', async (req,res)=>{
  try {
      const kml = await KmlModel.findById(req.params.kmlId).exec();
      res.send(kml);
  } catch (error) {
      res.status(500).send(error);
  }
})

router.post('/', async (req, res) => {
  try {
      const kml = new KmlModel(req.body);
      const result = await kml.save();
      res.send(result);
  } catch (error) {
      res.status(500).send(error);
  }
});

router.put('/:kmlId', async (req, res) => {
  try {
    const kml = await KmlModel.findById(req.params.kmlId).exec();
    kml.set(req.body);
    const result = await kml.save();
    res.send(result);
  } catch  (error) {
    res.status(500).send(error);

  }
});

router.delete('/:kmlId', async (req, res) => {
  KmlModel.findByIdAndRemove(req.params.kmlId, (err, kml) => {
      // As always, handle any potential errors:
      if (err) return res.status(500).send(err);
      // We'll create a simple object to send back with a message and the id of the document that was removed
      // You can really do this however you want, though.
      const response = {
          message: "KML successfully deleted",
          id: kml._id
      };
      return res.status(200).send(response);
  });
});

module.exports = router;

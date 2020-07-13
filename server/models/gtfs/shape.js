const mongoose = require('mongoose');

const ShapeSchema = new mongoose.Schema({
  
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  shape_id: {
    type: String,
    required: true,
    index: true
  },
  shape_pt_lat: {
    type: Number,
    required: true
  },
  shape_pt_lon: {
    type: Number,
    required: true
  },
  shape_pt_sequence: {
    type: Number,
    required: true
  },
  shape_dist_traveled: Number
})



const Shape = mongoose.model('Shape', ShapeSchema);

module.exports = Shape;

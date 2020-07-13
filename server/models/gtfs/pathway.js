const mongoose = require('mongoose');

const PathwaySchema = new mongoose.Schema({
  
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  pathway_id: {
    type: String,
    required: true,
    index: true
  },
  from_stop_id: {
    type: Number,
    required: true
  },
  to_stop_id: {
    type: Number,
    required: true
  },
  pathway_mode: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  is_bidirectional: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }
})



const Pathway = mongoose.model('Pathway', PathwaySchema);

module.exports = Pathway;

const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({

  agency_key: {
    type: String,
    required: false,
    index: true
  },
  stop_id: {
    type: String,
    required: true,
    index: true
  },
  stop_code: {
    type: String,
    index: true
  },
  stop_name: {
    type: String,
    required: true
  },
  stop_desc: String,
  stop_lat: {
    type: Number,
    required: true,
  },
  stop_lon: {
    type: Number,
    required: true,
  },
  zone_id: String,
  stop_url: String,
  location_type: {
    type: Number,
    min: 0,
    max: 1
  },
  parent_station: String,
  stop_timezone: String,
  wheelchair_boarding: {
    type: Number,
    min: 0,
    max: 2
  },
  level_id: {
    type: Number
  },
  platform_code: {
    type: String
  },
  icon: {
    type: String
  }
})


const Stop = mongoose.model('Stop', StopSchema);

module.exports = Stop;

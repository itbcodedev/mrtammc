const mongoose = require('mongoose');

const stopTimeSchema = new mongoose.Schema({
  trip_id: {
    type: String,
    required: true,
    index: true
  },
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  arrival_time: {
    type: String,
    required: true
  },
  departure_time: {
    type: String
  },
  stop_id: {
    type: String,
    required: true,
    index: true
  },
  stop_sequence: {
    type: Number,
    required: true,
    min: 0
  },
  stop_headsign: {
      type: String
  },
  pickup_type: {
    type: Number,
    min: 0,
    max: 3
  },
  drop_off_type: {
    type: Number,
    min: 0,
    max: 3
  },
  shape_dist_traveled: Number,
  timepoint: {
    type: Number,
    min: 0,
    max: 1
  }
});

const StopTime = mongoose.model('StopTime', stopTimeSchema);
module.exports = StopTime

const mongoose = require('mongoose');

const RouteInfoSchema = new mongoose.Schema({
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
  route_name: {
    type: String,
    required: true,
    index: true
  },
  route_id: {
    type: String,
    index: true
  },

  start_point: {
    type: String,
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_point: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  length: {
    type: String,
    required: true
  },
  runtime: {
    type: String
  },
  direction: {
    type: String
  },
  speed: {
    type: String
  },
  calendar: {
    type: String
  }
})

const RouteInfo = mongoose.model('RouteInfo', RouteInfoSchema);

module.exports = RouteInfo;

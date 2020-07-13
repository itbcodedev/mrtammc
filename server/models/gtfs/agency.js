const mongoose = require('mongoose');

const AgencySchema = new mongoose.Schema({
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  agency_id: String,
  agency_name: {
    type: String,
    required: true
  },
  agency_url: {
    type: String,
    required: true
  },
  agency_timezone: {
    type: String,
    required: true
  },
  agency_lang: String,
  agency_phone: String,
  agency_fare_url: String,
  agency_email: String
})


const Agency = mongoose.model('Agency', AgencySchema);

module.exports = Agency;

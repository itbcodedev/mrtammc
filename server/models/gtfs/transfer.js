const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
  
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  from_stop_id: {
    type: String,
    required: true
  },
  to_stop_id: {
    type: String,
    required: true
  },
  transfer_type: {
    type: Number,
    required: true,
    index: true,
    min: 0,
    max: 3
  },
  min_transfer_time: {
    type: Number,
    min: 0
  }
})

const Transfer = mongoose.model('Transfer', TransferSchema);

module.exports = Transfer;

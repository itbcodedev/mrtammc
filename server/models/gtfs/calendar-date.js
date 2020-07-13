const mongoose = require('mongoose');

const CalendarDateSchema = new mongoose.Schema({

  agency_key: {
    type: String,
    required: false,
    index: true
  },
  service_id: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  exception_type: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  holiday_name: String
})

const CalendarDate = mongoose.model('CalendarDate', CalendarDateSchema);


module.exports = CalendarDate

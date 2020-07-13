const mongoose = require('mongoose');

const FeedInfoSchema = new mongoose.Schema({
  
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  trip_id: {
    type: String,
    required: true,
    index: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  headway_secs: {
    type: Number,
    required: true,
    min: 0
  },
  exact_times: {
    type: Number,
    min: 0,
    max: 1
  }
})



const Frequency = mongoose.model('Frequency', FeedInfoSchema);



module.exports = Frequency;

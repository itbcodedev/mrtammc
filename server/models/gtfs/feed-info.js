const mongoose = require('mongoose');

const FeedInfoSchema = new mongoose.Schema({
  
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  feed_publisher_name: {
    type: String,
    required: true
  },
  feed_publisher_url: {
    type: String,
    required: true
  },
  feed_lang: {
    type: String,
    required: true
  },
  feed_start_date: {
    type: Number,
    min: 10000000
  },
  feed_end_date: {
    type: Number,
    min: 10000000
  },
  feed_version: String
})



const FeedInfo = mongoose.model('FeedInfo', FeedInfoSchema);


module.exports = FeedInfo;

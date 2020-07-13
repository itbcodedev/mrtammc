const mongoose = require('mongoose');

const FareRuleSchema = new mongoose.Schema({
  
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  fare_id: {
    type: String,
    required: true
  },
  route_id: String,
  origin_id: String,
  destination_id: String,
  contains_id: String
})



const FareRule = mongoose.model('FareRule', FareRuleSchema);



module.exports = FareRule;

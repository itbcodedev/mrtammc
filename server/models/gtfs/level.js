const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  
  agency_key: {
    type: String,
    required: false,
    index: true
  },
  level_id: {
    type: String,
    required: true
  },
  level_index: {
    type: String,
    required: true
  },
  level_name: {
    type: String,
    required: true,
    index: true
  }
})

const Level = mongoose.model('Level', LevelSchema);

module.exports = Level;

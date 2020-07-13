const Level = require('../../models/gtfs/level');

// Create and Save a new Note
exports.createLevel = async (req, res, next) => {
  try {
    const newLevel = new Level(req.body)
    const level = await newLevel.save();
    res.status(201).json(level)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllLevel = async (req, res, next) => {
  try {
    const  levels = await Level.find({});
    res.status(200).json(levels)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneLevel = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateLevel = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteLevel = (req, res) => {

};

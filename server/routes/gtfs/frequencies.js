const Frequency = require('../../models/gtfs/frequencies');

// Create and Save a new Note
exports.createFrequency = async (req, res,next) => {
  try {
    const newFrequency = new Frequency(req.body)
    const frequency = await newFrequency.save();
    res.status(201).json(frequency)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllFrequency = async (req, res, next) => {
  try {
    const  frequencies = await Frequency.find({});
    res.status(200).json(frequencies)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneFrequency = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateFrequency = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteFrequency = (req, res) => {

};

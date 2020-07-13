const StopTime = require('../../models/gtfs/stop-time');

// Create and Save a new Note
exports.createStoptime = async (req, res, next) => {
  try {
    const newStopTime = new StopTime(req.body)
    const stoptime = await newStopTime.save();
    res.status(201).json(stoptime)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllStoptime = async (req, res, next) => {
  try {
    const  stoptimes = await StopTime.find({});
    res.status(200).json(stoptimes)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneStoptime = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateStoptime = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteStoptime = (req, res) => {

};

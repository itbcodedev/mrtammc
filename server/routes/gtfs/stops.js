const Stop = require('../../models/gtfs/stop');

// Create and Save a new Note
exports.createStop = async (req, res, next ) => {
  try {
    const newStop = new Stop(req.body)
    const stop = await newStop.save();
    res.status(201).json(stop)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllStop = async (req, res, next) => {
  try {
    const  stops = await Stop.find({});
    res.status(200).json(stops)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneStop = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateStop = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteStop = (req, res) => {

};


// Delete a note with the specified noteId in the request
exports.getStopsAsGeoJSON = (req, res) => {

};

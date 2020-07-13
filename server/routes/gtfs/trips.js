const Trip = require('../../models/gtfs/trip');

// Create and Save a new Note
exports.createTrip = async (req, res, next) => {
  try {
    const newTrip = new Trip(req.body)
    const trip = await newTrip.save();
    res.status(201).json(trip)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllTrip = async (req, res, next) => {
  try {
    const  trips = await Trip.find({});
    res.status(200).json(trips)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneTrip = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateTrip = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteTrip = (req, res) => {

};


// getDirectionsByRoute
exports.getDirectionsByRoute = (req, res) => {

};

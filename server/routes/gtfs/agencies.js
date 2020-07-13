const Agency = require('../../models/gtfs/agency');

// Create and Save a new Note
exports.createAgency = async (req, res, next) => {
  try {
    const newAgency = new Agency(req.body)
    const agency = await newAgency.save();
    res.status(201).json(agency)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllAgency = async (req, res, next) => {
  try {
    const  agencies = await Agency.find({});
    res.status(200).json(agencies)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneAgency = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateAgency = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteAgency = (req, res) => {

};

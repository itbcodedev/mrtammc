const FareAttribute = require('../../models/gtfs/fare-atttribute');

// Create and Save a new Note
exports.createFareattribute = async (req, res, next) => {
  try {
    const newFareAttribute = new FareAttribute(req.body)
    const fareattribure = await newFareAttribute.save();
    res.status(201).json(fareattribure)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllFareattribute = async (req, res, next) => {
  try {
    const  fareattributes = await FareAttribute.find({});
    res.status(200).json(fareattributes)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneFareattribute = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateFareattribute = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteFareattribute = (req, res) => {

};

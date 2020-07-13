const FareRule = require('../../models/gtfs/fare-rule');

// Create and Save a new Note
exports.createFarerule = async (req, res, next) => {
  try {
    const newFareRule = new FareRule(req.body)
    const farerule = await newFareRule.save();
    res.status(201).json(farerule)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllFarerule = async (req, res, next) => {
  try {
    const  farerules = await FareRule.find({});
    res.status(200).json(farerules)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneFarerule = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateFarerule = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteFarerule = (req, res) => {

};

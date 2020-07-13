const Pathway = require('../../models/gtfs/pathway');

// Create and Save a new Note
exports.createPathway = async (req, res, next) => {
  try {
    const newPathway = new Pathway(req.body)
    const pathway = await newPathway.save();
    res.status(201).json(pathway)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllPathway = async (req, res, next) => {
  try {
    const  pathways = await Pathway.find({});
    res.status(200).json(pathways)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOnePathway = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updatePathway = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deletePathway = (req, res) => {

};

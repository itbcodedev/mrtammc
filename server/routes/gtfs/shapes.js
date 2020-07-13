const Shape = require('../../models/gtfs/shape');

// Create and Save a new Note
exports.createShape = async (req, res, next) => {
  try {
    const newShape = new Shape(req.body)
    const shape = await newShape.save();
    res.status(201).json(shape)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllShape = async (req, res) => {
  try {
    const  shapes = await Shape.find({});
    res.status(200).json(shapes)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneShape = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateShape = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteShape = (req, res) => {

};


// getShapesAsGeoJSON
exports.getShapesAsGeoJSON = (req, res) => {

};

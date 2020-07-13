const Route = require('../../models/gtfs/route');

// Create and Save a new Note
exports.createRoute = async (req, res, next) => {
  try {
    const newRoute = new Route(req.body)
    const route = await newRoute.save();
    res.status(201).json(route)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllRoute = async (req, res) => {
  try {
    const  routes = await Route.find({});
    res.status(200).json(routes)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneRoute = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateRoute = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteRoute = (req, res) => {

};

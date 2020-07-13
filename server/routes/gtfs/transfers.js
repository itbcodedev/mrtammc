const Transfer = require('../../models/gtfs/transfer');

// Create and Save a new Note
exports.createTransfer = async (req, res, next) => {
  try {
    const newTransfer = new Transfer(req.body)
    const transfer = await newTransfer.save();
    res.status(201).json(transfer)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllTransfer = async (req, res, next) => {
  try {
    const  transfers = await Transfer.find({});
    res.status(200).json(transfers)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneTransfer = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateTransfer = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteTransfer = (req, res) => {

};

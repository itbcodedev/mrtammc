const Calendar = require('../../models/gtfs/calendar');

// Create and Save a new Note
exports.createCalendar = async (req, res, next) => {
  try {
    const newCalendar = new Calendar(req.body)
    const calendar = await newCalendar.save();
    res.status(201).json(calendar)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllCalendar = async (req, res, next) => {
  try {
    const  calendars = await Calendar.find({});
    res.status(200).json(calendars)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneCalendar = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateCalendar = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteCalendar = (req, res) => {

};

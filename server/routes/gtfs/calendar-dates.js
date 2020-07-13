const CalendarDate = require('../../models/gtfs/calendar-date');
// Create and Save a new Note
exports.createCalendardate = async (req, res, next) => {
  try {
    const newCalendarDate = new CalendarDate(req.body)
    const calendardate = await newCalendarDate.save();
    res.status(201).json(calendardate)
  } catch (err) {
    next(err)
  }
};

// Retrieve and return all notes from the database.
exports.findAllCalendardate = async (req, res, next) => {
  try {
    const  calendardates = await CalendarDate.find({});
    res.status(200).json(calendardates)
  } catch (err) {
    next(err)
  }
};

// Find a single note with a noteId
exports.findOneCalendardate = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateCalendardate = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteCalendardate = (req, res) => {

};

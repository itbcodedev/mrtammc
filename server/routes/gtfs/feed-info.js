const FeedInfo = require('../../models/gtfs/feed-info');

// Create and Save a new Note
exports.createFeedinfo = (req, res) => {
  let FeedInfo = new FeedInfo(
    {
      agency_key: req.body.agency_key,
      feed_publisher_name: req.body.feed_publisher_name,
      feed_publisher_url: req.body.feed_publisher_url,
      feed_start_date: req.body.feed_start_date,
      feed_end_date: req.body.feed_end_date,
      feed_version: req.body.feed_version,
    }
  )
  FeedInfo.save((err) => {
    if (err) {
      return next(err)
    }
    res.send('FeedInfo Created successfully')
  })
};

// Retrieve and return all notes from the database.
exports.findAllFeedinfo = (req, res) => {
  res.status(200).send({
    message: "findAllFeedinfo "
  })
};

// Find a single note with a noteId
exports.findOneFeedinfo = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.updateFeedinfo = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.deleteFeedinfo = (req, res) => {

};

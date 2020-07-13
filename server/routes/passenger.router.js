var express = require('express');
var router = express.Router();
var Passenger = require('../models/passenser');
const requestIp = require('request-ip');


module.exports = function(io) {

  router.post('/', (req, res, next) => {

    io.sockets.emit('passenger', req.body);
    var passenger = new Passenger({
      time: req.body.time,
      station: req.body.station,
      density: req.body.density,
      create_on: Date.now(),
      ipaddr: requestIp.getClientIp(req)
    });

    passenger.save((err, alert) => {
      if (err) {
        return next(err);
      }
      const message = {
        message: "Passenger create successfully",
        data: alert
      }
      res.status(201).json(message)
    });


    // return res.status(200).json(req.body);

  });

  router.get('/', (req, res, next) => {
    Passenger.aggregate([
      {$sort:{create_on:-1} },
      {$match: {}},
      {$group: { _id: "$station", stations: { $push: "$$ROOT"}}},
      {$replaceRoot: { newRoot: { $arrayElemAt: ["$stations", 0] }}}
    ]).exec((err, passengers) => {
      return res.status(200).json(passengers);
    });
  });

  return router
};

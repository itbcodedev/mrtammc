const express = require('express');
const router = express.Router();
const db = require('../database').DATABASE;

let activetrains;

var printError = function(error, explicit) {
  console.log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`);
}


router.get('/agencies', async (req, res) => {
  res.json(db.agencies);

});

router.get('/stops', async (req, res) => {
  res.json(db.stops);
});

router.get('/routes', async (req, res) => {
  res.json(db.routes);
});

router.get('/trips', async (req, res) => {
  res.json(db.trips);
});

router.get('/stop_times', async (req, res) => {
  res.json(db.stop_times);
});

router.get('/calendars', async (req, res) => {
  res.json(db.calendar);
});

router.get('/calendar', async (req, res) => {
  const {
    serviceId
  } = req.query;

  if (serviceId) {
    let calendar = db.calendar.find(x => x.serviceId === serviceId);
    res.json(calendar);
  } else {
    res.json({});
  }
});


router.get('/shapes', async (req, res) => {
  res.json(db.shapes);
});


router.get('/shape_details/', async (req,res) => {
  const shape_details  = db.shape_details
  res.json(shape_details);
});

router.get('/periods/', async (req,res) => {
  const periods = db.periods
  res.json(periods);
});

router.get('/stoptimes/', async (req,res) => {
  const stops = db.stopWithStopTimes
  res.json(stops);
});

router.get('/stoptimes/:tripId', async (req,res) => {
  const { tripId } = req.params;
  const stops = db.stopWithStopTimes.filter(x => x.tripId === tripId);
  res.json(stops);
});

router.get('/stoptimesbystop/:stopId', async (req,res) => {
  const { stopId} = req.params;
  const stops = db.stopWithStopTimes.filter(x => x.stopId === stopId);
  res.json(stops);
});

router.get('/trips/:routeId', async (req, res) => {
  let first = "";
  let last = "";
  const { routeId } = req.params;
  let trips = db.trips.filter(x => x.routeId === routeId);
  let modifiedTrips = [];
  let totalTrips = 0
  for (let trip of trips) {
    const stops = db.stopWithStopTimes
      .filter(x => x.tripId === trip.tripId);
    try {
      first = stops[0].stopName;
    } catch (e) {
      console.log(e);
    }
    try {
      last = stops[stops.length - 1].stopName;
    } catch (e) {
      console.log(e);
    }
    // construct display on dashboard
    const newTrip = Object.assign({}, trip, {
      name: 'ทริป: ' + trip.tripId + '-' + 'จำนวน ' +stops.length + ' ขบวน' ,
      detail: first +' to '+ last
    });

    modifiedTrips.push(newTrip);
  }
  res.json(modifiedTrips);
});


router.get('/stopsbytrip', async (req, res) => {
  const {
    tripId,
    routeId,
    stopId
  } = req.query;
  let routes = db.stopWithStopTimes;
  let time = new Date();
  let Secs = +time.getHours()*3600 + +time.getMinutes()*60 +  +time.getSeconds();

  if (tripId) {
    routes = routes.filter(x => x.tripId === tripId);
    //routes = routes.filter(x => x.tripId === tripId).filter(x => x.Minutes >=  Minutes);
  }
  if (routeId) {
    routes = routes.filter(x => x.routeId === routeId);
    //routes = routes.filter(x => x.routeId === routeId).filter(x => x.Minutes >=  Minutes);
  }
  if (stopId) {
    routes = routes.filter(x => x.stopId === stopId);
    //routes = routes.filter(x => x.stopId === stopId).filter(x => x.Minutes >=  Minutes);
  }

  res.json(routes);
});

router.get('/trainbytrip', async (req, res) => {
  const {
    tripId,
    routeId,
    stopId
  } = req.query;

  let routes = db.stopWithStopTimes;
  let time = new Date();
  let Secs = +time.getHours()*3600 + +time.getMinutes()*60 + +time.getSeconds();

  if (tripId) {
    routes = routes.filter(x => x.tripId === tripId);
    //routes = routes.filter(x => x.tripId === tripId).filter(x => x.Minutes <=  Minutes);
  }
  if (routeId) {
    routes = routes.filter(x => x.routeId === routeId);
    //routes = routes.filter(x => x.routeId === routeId).filter(x => x.Minutes <=  Minutes);
  }
  if (stopId) {
    routes = routes.filter(x => x.stopId === stopId);
    //routes = routes.filter(x => x.stopId === stopId).filter(x => x.Minutes <=  Minutes);
  }
  res.json(routes);
});

router.get('/routes/:agencyId', async (req, res) => {
  const {
    agencyId
  } = req.params;
  const routes = db.routes.filter(x => x.agencyId === agencyId);
  res.json(routes);
});

router.get('/stopwithroutes', async (req, res) => {
  const stops = db.stopWithRoutes;
  res.json(stops);
});

router.post('/updateactivetrains', (req , res, next) => {
  activetrains = req.body;
  //console.log(activetrains);
  return res.status(200).json({message: "updateActiveTrains"})
});

router.get('/activetrains', (req,res) => {
  return res.status(200).json({message: "updateActiveTrains", time: Date.now(), activetrains: activetrains})
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Standard GTFS Filenames
const { liveUpdate } = require('./gtfs/utils');
const {createAgency, findAllAgency, findOneAgency, updateAgency, deleteAgency} = require('./gtfs/agencies');
const {createCalendar, findAllCalendar, findOneCalendar, updateCalendar, deleteCalendar} = require('./gtfs/calendars');
const {createCalendardate, findAllCalendardate, findOneCalendardate,  updateCalendardate, deleteCalendardate} = require('./gtfs/calendar-dates');
const {createFareattribute, findAllFareattribute, findOneFareattribute, updateFareattribute, deleteFareattribute } = require('./gtfs/fare-attributes');
const {createFarerule, findAllFarerule, findOneFarerule, updateFarerule, deleteFarerule} = require('./gtfs/fare-rules');
const {createFeedinfo, findAllFeedinfo, findOneFeedinfo, updateFeedinfo, deleteFeedinfo} = require('./gtfs/feed-info');
const {createFrequency, findAllFrequency, findOneFrequency, updateFrequency,  deleteFrequency } = require('./gtfs/frequencies');
const {createRoute, findAllRoute, findOneRoute, updateRoute, deleteRoute} = require('./gtfs/routes');
const {createShape, findAllShape, findOneShape, updateShape, deleteShape, getShapesAsGeoJSON} = require('./gtfs/shapes');
const {createStop, findAllStop, findOneStop, updateStop, deleteStop, getStopsAsGeoJSON} = require('./gtfs/stops');
const {createStoptime, findAllStoptime, findOneStoptime, updateStoptime, deleteStoptime} = require('./gtfs/stop-times');
const { createTransfer, findAllTransfer, findOneTransfer, updateTransfer, deleteTransfer} = require('./gtfs/transfers');
const {createTrip, findAllTrip, findOneTrip, updateTrip, deleteTrip, getDirectionsByRoute} = require('./gtfs/trips');
const {createPathway, findAllPathway, findOnePathway, updatePathway, deletePathway } = require('./gtfs/pathways');
const {createLevel, findAllLevel, findOneLevel, updateLevel, deleteLevel } = require('./gtfs/levels');

router.post('/liveupdate/:model',liveUpdate)
router.post('/agencies', createAgency);
router.get('/agencies', findAllAgency);
router.get('/agencies/:agencyId', findOneAgency);
router.put('/agencies/:agencyId', updateAgency);
router.delete('/agencies/:agencyId', deleteAgency);

router.post('/calendars', createCalendar);
router.get('/calendars', findAllCalendar);
router.get('/calendars/:calendarId', findOneCalendar);
router.put('/calendars/:calendarId', updateCalendar);
router.delete('/calendars/:calendarId', deleteCalendar);

router.post('/calendardates', createCalendardate);
router.get('/calendardates', findAllCalendardate);
router.get('/calendardates/:calendardateId', findOneCalendardate);
router.put('/calendardates/:calendardateId', updateCalendardate);
router.delete('/calendardates/:calendardateId', deleteCalendardate);


router.post('/fareattributes', createFareattribute);
router.get('/fareattributes', findAllFareattribute);
router.get('/fareattributes/:fareattributeId', findOneFareattribute);
router.put('/fareattributes/:fareattributeId', updateFareattribute);
router.delete('/fareattributes/:fareattributeId', deleteFareattribute);


router.post('/farerules', createFarerule);
router.get('/farerules', findAllFarerule);
router.get('/farerules/:fareruleId', findOneFarerule);
router.put('/farerules/:fareruleId', updateFarerule);
router.delete('/farerules/:fareruleId', deleteFarerule);


router.post('/feedinfos', createFeedinfo);
router.get('/feedinfos', findAllFeedinfo);
router.get('/feedinfos/:feedinfoId', findOneFeedinfo);
router.put('/feedinfos/:feedinfoId', updateFeedinfo);
router.delete('/feedinfos/:feedinfoId', deleteFeedinfo);

router.post('/frequencies', createFrequency);
router.get('/frequencies', findAllFrequency);
router.get('/frequencies/:frequencieId', findOneFrequency);
router.put('/frequencies/:frequencieId', updateFrequency);
router.delete('/frequencies/:frequencieId', deleteFrequency);


router.post('/routes', createRoute);
router.get('/routes', findAllRoute);
router.get('/routes/:routesId', findOneRoute);
router.put('/routes/:routesId', updateRoute);
router.delete('/routes/:routesId', deleteRoute);


router.post('/shapes', createShape);
router.get('/shapes', findAllShape);
router.get('/shapes/:shapeId', findOneShape);
router.put('/shapes/:shapeId', updateShape);
router.delete('/shapes/:shapeId', deleteShape);


router.post('/stops', createStop);
router.get('/stops', findAllStop);
router.get('/stops/:stopId', findOneStop);
router.put('/stops/:stopId', updateStop);
router.delete('/stops/:stopId', deleteStop);


router.post('/stoptimes', createStoptime);
router.get('/stoptimes', findAllStoptime);
router.get('/stoptimes/:agencyId', findOneStoptime);
router.put('/stoptimes/:agencyId', updateStoptime);
router.delete('/stoptimes/:agencyId', deleteStoptime);


router.post('/transfers', createTransfer);
router.get('/transfers', findAllTransfer);
router.get('/transfers/:agencyId', findOneTransfer);
router.put('/transfers/:agencyId', updateTransfer);
router.delete('/transfers/:agencyId', deleteTransfer);


router.post('/trips', createTrip);
router.get('/trips', findAllTrip);
router.get('/trips/:tripId', findOneTrip);
router.put('/trips/:tripId', updateTrip);
router.delete('/trips/:tripId', deleteTrip);



router.post('/pathways', createPathway);
router.get('/pathways', findAllPathway);
router.get('/pathways/:pathwayId', findOnePathway);
router.put('/pathways/:pathwayId', updatePathway);
router.delete('/pathways/:pathwayId', deletePathway);


router.post('/levels', createLevel);
router.get('/levels', findAllLevel);
router.get('/levels/:levelId', findOneLevel);
router.put('/levels/:levelId', updateLevel);
router.delete('/levels/:levelId', deleteLevel);

module.exports = router;

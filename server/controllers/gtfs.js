// GTFS import script
//const importGTFS = require('./import');

// Standard GTFS Filenames
const {getAgencies} = require('./gtfs/agencies');
const {getCalendars} = require('./gtfs/calendars');
const {getCalendarDates} = require('./gtfs/calendar-dates');
const {getFareAttributes} = require('./gtfs/fare-attributes');
const {getFareRules} = require('./gtfs/fare-rules');
const {getFeedInfo} = require('./gtfs/feed-info');
const {getFrequencies} = require('./gtfs/frequencies');
const {getRoutes, getRoutesBasic} = require('./gtfs/routes');
const {getShapes, getShapesAsGeoJSON} = require('./gtfs/shapes');
const {getStops, getStopsAsGeoJSON, updateStops, deleteStops, createStops} = require('./gtfs/stops');
const {getStoptimes, getStoptimesBasic, getallstoptimes, getallstops} = require('./gtfs/stop-times');
const {getTransfers} = require('./gtfs/transfers');
const {getTrips, getDirectionsByRoute} = require('./gtfs/trips');
const { getRouteInfo, getRouteInfoWithTrip} = require('./gtfs/route-info')
// Non-standard GTFS Filenames
const {getStopAttributes} = require('./non-standard/stop-attributes');
const {getTimetables} = require('./non-standard/timetables');
const {getTimetableStopOrders} = require('./non-standard/timetable-stop-order');
const {getTimetablePages} = require('./non-standard/timetable-pages');

// exports.import = importGTFS;

exports.getAgencies = getAgencies;

exports.getCalendarDates = getCalendarDates;

exports.getCalendars = getCalendars;

exports.getFareAttributes = getFareAttributes;

exports.getFareRules = getFareRules;

exports.getFeedInfo = getFeedInfo;

exports.getFrequencies = getFrequencies;

exports.getRoutes = getRoutes;
exports.getRoutesBasic = getRoutesBasic;
exports.getShapes = getShapes;
exports.getShapesAsGeoJSON = getShapesAsGeoJSON;

exports.getStops = getStops;
exports.getStoptimesBasic =  getStoptimesBasic;
exports.updateStops = updateStops
exports.deleteStops = deleteStops
exports.createStops = createStops
exports.getStopsAsGeoJSON = getStopsAsGeoJSON;

exports.getStoptimes = getStoptimes;

exports.getTransfers = getTransfers;

exports.getTrips = getTrips;
exports.getDirectionsByRoute = getDirectionsByRoute;

exports.getStopAttributes = getStopAttributes;

exports.getTimetables = getTimetables;

exports.getTimetableStopOrders = getTimetableStopOrders;

exports.getTimetablePages = getTimetablePages;

exports.getRouteInfo = getRouteInfo
exports.getRouteInfoWithTrip = getRouteInfoWithTrip
exports.getallstoptimes = getallstoptimes
exports.getallstops = getallstops
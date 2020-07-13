const {
  loadGTFSDataFromFile,
  loadStopsWithTrip,
  loadStopsWithStopTimes,
  loadStopswithRoutes
} = require('./routes/gtfs-helper');

const DATABASE = {
  agencies: [],
  routes: [],
  trips: [],
  stops: [],
  calendar: [],
  shapes: [],
  periods: []
};

async function init() {
  DATABASE.agencies = await loadGTFSDataFromFile('./feed/agency.txt');
  DATABASE.stops = await loadGTFSDataFromFile('./feed/stops.txt');
  DATABASE.routes = await loadGTFSDataFromFile('./feed/routes.txt');
  DATABASE.shapes = await loadGTFSDataFromFile('./feed/shapes.txt');
  DATABASE.shape_details = await loadGTFSDataFromFile('./feed/shape_details.txt');
  DATABASE.periods = await loadGTFSDataFromFile('./feed/periods.txt');
  DATABASE.trips = await loadGTFSDataFromFile('./feed/trips.txt');
  DATABASE.calendar = await loadGTFSDataFromFile('./feed/calendar.txt');
  DATABASE.stop_times = await loadGTFSDataFromFile('./feed/stop_times.txt');
  DATABASE.stopWithStopTimes = await loadStopsWithStopTimes();
  DATABASE.stopsWithTrip = await loadStopsWithTrip();
  DATABASE.stopWithRoutes = await loadStopswithRoutes();

};

module.exports = {
  init,
  DATABASE
};

const numericFields = {
  stopSequence: 1,
  monday: 1,
  tuesday: 1,
  wednesday: 1,
  thursday: 1,
  friday: 1,
  saturday: 1,
  sunday: 1
};


function isNumeric(value) {
  return !isNaN(value);
}

const isNumericField = field => (numericFields[field] ? true : false);

function loadGTFSDataFromFile(filepath, agency_key) {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let fields = [];
    let data = [];

    const fileHandler = require('readline').createInterface({
      input: require('fs').createReadStream(filepath)
    });

    fileHandler.on('line', line => {
      const cells = line.split(',');
      // first line is field name
      if (lineCount === 0) {
        cells.forEach(c => fields.push(c));
      } else {
        let resource = {};
        resource['agency_key'] = agency_key
        for (let i = 0; i < fields.length; i++) {
          const name = fields[i];
          resource[name] = isNumericField(name) ?
            Number.parseInt(cells[i]) :
            cells[i];
        }

        data.push(resource);
      }

      lineCount++;
    });

    fileHandler.on('close', () => {
      resolve(data);
    });
  });
}


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mmcmrtadb', function (err) {
   if (err) throw err;
   console.log('Successfully to Database connected');
});

const Agency = require('./models/gtfs/agency')
const CalendarDate = require('./models/gtfs/calendar-date')
const Calendar = require('./models/gtfs/calendar')
const FareAttribute =  require('./models/gtfs/fare-atttribute')
const FareRule = require('./models/gtfs/fare-rule')
const FeedInfo = require('./models/gtfs/feed-info')
const Frequency = require('./models/gtfs/level')
const Level = require('./models/gtfs/level')
const Pathway = require('./models/gtfs/pathway')
const Route = require('./models/gtfs/route')
const Shape = require('./models/gtfs/shape')
const StopTime = require('./models/gtfs/stop-time')
const Stop = require('./models/gtfs/stop')
const Transfer = require('./models/gtfs/transfer')
const Trip = require('./models/gtfs/trip')
const RouteInfo = require('./models/gtfs/route-info')



const DATABASE = {
  agencies: [],
  routes: [],
  trips: [],
  stops: [],
  calendar: [],
  shapes: [],
  periods: [],
  route_infos: []
};


async function init() {

  agency_key = "MRTA_Transit"
  DATABASE.agencies = await loadGTFSDataFromFile('./feed/agency.txt', agency_key);
  DATABASE.stops = await loadGTFSDataFromFile('./feed/stops.txt', agency_key);
  DATABASE.routes = await loadGTFSDataFromFile('./feed/routes.txt', agency_key);
  DATABASE.shapes = await loadGTFSDataFromFile('./feed/shapes.txt', agency_key);
  DATABASE.shape_details = await loadGTFSDataFromFile('./feed/shape_details.txt', agency_key);
  DATABASE.periods = await loadGTFSDataFromFile('./feed/periods.txt', agency_key);
  DATABASE.trips = await loadGTFSDataFromFile('./feed/trips.txt', agency_key);
  DATABASE.calendar = await loadGTFSDataFromFile('./feed/calendar.txt', agency_key);
  DATABASE.stop_times = await loadGTFSDataFromFile('./feed/stop_times.txt', agency_key);
  DATABASE.route_infos = await loadGTFSDataFromFile('./feed/route_infos.txt', agency_key);

  console.log("Summary Report On Initialdatabase")
  console.log("---------------------------------")
  await Agency.deleteMany({})
  await Agency.insertMany(DATABASE.agencies)
  await Agency.count({}, function(err, count){
    console.log( "Number of Agency record: ", count );
  });
      
  await Stop.deleteMany({})
  await Stop.insertMany(DATABASE.stops)
  await Stop.count({}, function(err, count){
    console.log( "Number of Stop record: ", count );
  });
          
  await Route.deleteMany({})
  await Route.insertMany(DATABASE.routes)
  await Route.count({}, function(err, count){
    console.log( "Number of Route record: ", count );
  });
  
  await Shape.deleteMany({})
  await Shape.insertMany(DATABASE.shapes)
  await Shape.count({}, function(err, count){
    console.log( "Number of Shape record: ", count );
  });
      
  await Trip.deleteMany({})
  await Trip.insertMany(DATABASE.trips)
  await Trip.count({}, function(err, count){
    console.log( "Number of Trip record: ", count );
  });
  
  await Calendar.deleteMany({})
  await Calendar.insertMany(DATABASE.calendar)
  await Calendar.count({}, function(err, count){
    console.log( "Number of Calendar record: ", count );
  });
  
  await StopTime.deleteMany({})
  await StopTime.insertMany(DATABASE.stop_times)
  await StopTime.count({}, function(err, count){
    console.log( "Number of StopTime record: ", count );
  });
  
  await RouteInfo.deleteMany({})
  await RouteInfo.insertMany(DATABASE.route_infos)
  await RouteInfo.count({}, function(err, count){
    console.log( "Number of RouteInfo record: ", count );
  });


  return 1
};

module.exports =  {
  init,
  DATABASE
}

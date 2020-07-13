const isStringNullOrEmpty = str => str === null || str.length === 0;

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
const isNumericField = field => (numericFields[field] ? true : false);

function loadGTFSDataFromFile(filepath) {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let fields = [];
    let data = [];

    const fileHandler = require('readline').createInterface({
      input: require('fs').createReadStream(filepath)
    });

    fileHandler.on('line', line => {
      const cells = line.split(',');
      if (lineCount === 0) {
        //cells.forEach(c => fields.push(toJsonNamingConvention(c)));
        cells.forEach(c => fields.push(c));
      } else {
        let resource = {};
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

async function loadStopsWithTrip() {
  const stops = await loadGTFSDataFromFile('./feed/stops.txt');
  const stop_times = await loadGTFSDataFromFile('./feed/stop_times.txt');
  const trips = await loadGTFSDataFromFile('./feed/trips.txt');

  const joinedStopTimes = [];
  for (const stopTime of stop_times) {
    const stop = stops.find(x => x.stopId === stopTime.stopId);
    const trip = trips.find(x => x.tripId === stopTime.tripId);

    const newStopTime = Object.assign({}, stopTime, stop, trip);
    joinedStopTimes.push(newStopTime);
  }

  return joinedStopTimes;
}


async function loadStopswithRoutes() {

  const routes = await loadGTFSDataFromFile('./feed/routes.txt');
  const trips = await loadGTFSDataFromFile('./feed/trips.txt');
  const stop_times = await loadGTFSDataFromFile('./feed/stop_times.txt');
  const stops = await loadGTFSDataFromFile('./feed/stops.txt');

  let final = [];
  let unique = [];

  for (const route of routes) {
    stoplist = [];
    for (const stoptime of stop_times) {

      const tripid = stoptime.tripId;
      const trip = trips.find(x => x.tripId == tripid);

      const stopid = stoptime.stopId;

      stop = stops.find(x => x.stopId == stopid);

      const stopsequence = stoptime.stopSequence;

      if ( trip != undefined && trip.routeId == route.routeId ) {
        // createe object
        const object = {
          stopid: stopid,
          stopname: stop.stopName,
          stoplat: stop.stopLat,
          stoplon: stop.stopLon,
          stopsequence: stopsequence,
        }
        stoplist.push(object);
        unique = [...new Set(stoplist.map(item => item.stopid))];
      }
    }
    // clean
    let unique_stoplist = stoplist.slice(0,unique.length);

    final.push({
      route: route.routeId,
      routename: route.routeShortName,
      stops:  unique_stoplist
    });
  }
  // get frist array member
  return final;
}

async function loadStopsWithStopTimes() {
  const stops = await loadGTFSDataFromFile('./feed/stops.txt');
  const stop_times = await loadGTFSDataFromFile('./feed/stop_times.txt');
  const trips = await loadGTFSDataFromFile('./feed/trips.txt');


  const joinedStopTimes = [];
  if (stop_times !== undefined ) {
    for (const stopTime of stop_times) {
      const stop = stops.find(x => x.stopId == stopTime.stop_id);
      const trip = trips.find(x => x.tripId == stopTime.trip_id);
      let time = stopTime.arrival_time;
      let end = stopTime.departure_time;
      tt = time.split(":");
      secs = +tt[0] * 3600 + +tt[1] * 60 + +tt[2];
      ee = end.split(":");
      ends = +ee[0] * 3600 + +ee[1] * 60 + +ee[2];

      stopTime.arrivalSecs = secs;
      stopTime.departureSecs = ends;
      const newStopTime = Object.assign({}, stopTime, stop, trip);
      joinedStopTimes.push(newStopTime);
    }

  }


  //The entries() method returns a new Array Iterator object that contains the key/value
  // var array1 = ['a', 'b', 'c'];
  // var iterator1 = array1.entries();

  // console.log(iterator1.next().value);
  // expected output: Array [0, "a"]

  // for (const [i, stopTime] of joinedStopTimes.entries()) {
  //   console.log('152 i', i)
  //   console.log('153 stopTime', stopTime)
  //
  //   if (stopTime.stopSequence === 1) {
  //     stopTime.diffSecs = 0;
  //   } else {
  //     stopTime.diffSecs = stopTime.diffSecs - joinedStopTimes[i - 1].diffSecs;
  //   }
  //
  //   console.log('163 stopTime', stopTime)
  // }
  return joinedStopTimes;
}

async function loadTripsToRoute(routes) {
  const trips = await loadGTFSDataFromFile('./feed/trips.txt');
  const stops = await loadGTFSDataFromFile('./feed/stops.txt');
  const stop_times = await loadGTFSDataFromFile('./feed/stop_times.txt');

  console.log(trips)
  const joinedStopTimes = [];
  for (const stopTime of stop_times) {
    const stop = stops.find(x => x.stopId === stopTime.stopId);
    const newStopTime = Object.assign({}, stopTime, stop);
    joinedStopTimes.push(newStopTime);
  }

  const joinedTrips = [];
  for (const trip of trips) {
    const stopTimes = joinedStopTimes.filter(x => x.tripId === trip.tripId);
    const newTrip = Object.assign({}, trip, {
      stops: stopTimes
    });

    joinedTrips.push(newTrip);
  }

  return joinedTrips;
}

function toJsonNamingConvention(str) {
  if (isStringNullOrEmpty(str)) {
    return str;
  }
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  return str
    .split('_')
    .map((x, i) => (i === 0 ? x : capitalize(x)))
    .join('');
}

function isNumeric(value) {
  return !isNaN(value);
}





module.exports = {
  loadGTFSDataFromFile,
  loadTripsToRoute,
  loadStopsWithStopTimes,
  loadStopsWithTrip,
  loadStopswithRoutes
};

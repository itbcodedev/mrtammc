const _ = require('lodash');

const StopTime = require('../../models/gtfs/stop-time');
const Trip = require('../../models/gtfs/trip');

/*
 * Returns an array of stoptimes that match the query parameters.
 */
exports.getStoptimes = async (query = {}, projection = '-_id', options = {
  lean: true,
  sort: {
    stop_sequence: 1
  },
  timeout: true
}) => {
  if (query.agency_key === 'undefined') {
    throw new Error('`agency_key` is a required parameter.');
  }

  const stoptimeQuery = _.omit(query, ['service_id', 'route_id', 'direction_id']);

  if (query.trip_id === undefined) {
    const tripQuery = {
      agency_key: query.agency_key
    };

    if (query.service_id !== undefined) {
      tripQuery.service_id = query.service_id;
    }

    if (query.route_id !== undefined) {
      tripQuery.route_id = query.route_id;
    }

    if (query.direction_id !== undefined) {
      tripQuery.direction_id = query.direction_id;
    }

    const tripIds = await Trip.find(tripQuery, {}, {
      timeout: true
    }).distinct('trip_id');

    stoptimeQuery.trip_id = {
      $in: tripIds
    };
    console.log('..routeid', query.route_id)
    console.log(tripIds)
  }
  //function
  let calculateHourTimestamp = (time) => {
    console.log(time)
    const split = time.split(':').map(d => parseInt(d, 10));
    if (split.length !== 3) {
      return null;
    }

    return (split[0] * 3600) + (split[1] * 60) + split[2];
  };

  let testValue = (time) => {
    console.log(time)
    return time
  }

  const stopsequenceQuery = {
    stop_sequence: { $in: [1,16]}
  }
  //return StopTime.find(stoptimeQuery, projection, options);
  return StopTime.aggregate([
    {$match: stoptimeQuery},
    {$match: stopsequenceQuery },
    {$sort: {trip_id: 1}},
    {$addFields: {route_id: query.route_id}},
    {
      $lookup: {
        from: "stops",
        localField: "stop_id",
        foreignField: "stop_id",
        as: "stop_info"
      }
    }
  ])
}

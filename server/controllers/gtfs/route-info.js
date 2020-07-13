const RouteInfo = require('../../models/gtfs/route-info');
/*
 * Returns an array of route_info that match the query parameters.
 */
exports.getRouteInfo = (query = {}, projection = '-_id', options = {lean: true, timeout: true}) => {
  // query.calendar = calendar.gtfsCalendar();
  return RouteInfo.find(query, projection, options);
};

/*
* Return array of route_id with stoptime link by trip_id
*/
exports.getRouteInfoWithTrip = (query = {}, projection = '-_id', options = {lean: true, timeout: true}) => {
  const routeInfoQuery = {}
  if (query.trip_id !== undefined){
    routeInfoQuery.trip_id = query.trip_id

  } else {
    //console.log("19 exports.getRouteInfoWithTrip  query undefined/",routeInfoQuery)
  }



  return RouteInfo.aggregate([
    {$match: routeInfoQuery},
    {$lookup: {
           from: "stoptimes",
           localField: "trip_id",
           foreignField: "trip_id",
           as: "stoptimes"
         }}
])
};

const path = require('./path')

console.log(path.station)
trip = { route_name: "purple", direction: 1}
function getStationfile(trip) {
  console.log(trip.route_name, trip.direction)
  const index = path.station.findIndex(c => {
    return (c.route_name == trip.route_name && c.direction == trip.direction )
  })
  if (index > -1) {
    return path.station[index].file
  }
}

file = getStationfile(trip)
console.log(file)

location = path[`${file}`].stations
console.log(location)


// //function
// let calculateHourTimestamp = (time) => {
//   console.log(time)
//   const split = time.split(':').map(d => parseInt(d, 10));
//   if (split.length !== 3) {
//     return null;
//   }
//
//   return (split[0] * 3600) + (split[1] * 60) + split[2];
// };
//
// secs = calculateHourTimestamp("8:0:10")
// console.log(secs)
//
// var date = new Date();
// var now = date.toLocaleTimeString().slice(0,8);
// console.log(now)
// console.log(calculateHourTimestamp(now))
//
// let timenow = () => {
//   date = new Date();
//   now = date.toLocaleTimeString().slice(0,8);
//   return calculateHourTimestamp(now)
// }
// console.log(timenow())

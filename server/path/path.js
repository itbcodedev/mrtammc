

const blue_in = require('./blue_in_index.json')
const blue_out = require('./blue_out_index.json')
const purplenorth_in = require('./purple_in_index.json')
const purplenorth_out = require('./purple_out_index.json')

const blue_station_in = require('./blue_station_in.json')
const blue_station_out = require('./blue_station_out.json')
const purplenorth_station_in = require('./purple_station_in.json')
const purplenorth_station_out = require('./purple_station_out.json')

//shape
exports.blue_in = blue_in
exports.blue_out = blue_out
exports.purplenorth_in = purplenorth_in
exports.purplenorth_out = purplenorth_out
//station
exports.blue_station_in = blue_station_in
exports.blue_station_out = blue_station_out
exports.purplenorth_station_in = purplenorth_station_in
exports.purplenorth_station_out = purplenorth_station_out

exports.config = [
  {
    route_name: "blue", direction: "0", file: "blue_in"
  },
  {
    route_name: "blue", direction: "1", file: "blue_out"
  },
  {
    route_name: "purple", direction: "0",  file: "purplenorth_in"
  },
  {
    route_name: "purple", direction: "1",  file: "purplenorth_out"
  }
]

exports.station = [
  {
    route_name: "blue", direction: "0", file: "blue_station_in"
  },
  {
    route_name: "blue", direction: "1", file: "blue_station_out"
  },
  {
    route_name: "purple", direction: "0",  file: "purplenorth_station_in"
  },
  {
    route_name: "purple", direction: "1",  file: "purplenorth_station_out"
  }
]

// in - 0, out - 1

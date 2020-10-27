const purplenorth_in = require('./purplenorthline_in.json')
const purplenorth_out = require('./purplenorthline_out.json')

//const blue_in = require('./BlueLine_in.json')  
//const blue_out = require('./BlueLine_out.json')

const blue_in = require('./blue_in_index.json')  
const blue_out = require('./blue_out_index.json')

// const purplenorth_in = require('./v2/purpleline5meter_in.json')
// const purplenorth_out = require('./v2/purpleline5meter_out.json')

// const blue_in = require('./v2/blueline5meter_in.json')
// const blue_out = require('./v2/blueline5meter_out.json')



exports.blue_in = blue_in
exports.blue_out = blue_out


exports.purplenorth_in = purplenorth_in
exports.purplenorth_out = purplenorth_out


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

// in - 0, out - 1
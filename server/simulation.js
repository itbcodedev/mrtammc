const {TrainSimulator} = require('../server/process/train_simulator');
const train_config = require('../simulation/train_config')
const path_config = require('../simulation/path_config.json')
const gtfs = require('../server/controllers/gtfs')
const request = require('request');
const simulate = async (io) => {

  const simulate_url = "http://localhost:3000/api/v2/simulate"
  //console.log('Simulate URL endpoint .....', simulate_url)

  const train = new TrainSimulator(gtfs)

  await train.main()
  train.trip_gtfs.map(trip => {
    // console.log("response to app socket");
    request({
        url: simulate_url,
        method: "POST",
        json: true,
        body: trip
    }, function (error, response, body){
        //console.log(response);
    });
  })

}

module.exports.simulate = simulate

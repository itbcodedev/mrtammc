const express = require('express');
const router = express.Router();


const gtfs = require('../controllers/gtfs')


//routers
module.exports = function(io) {

  router.get('/agencies', async (req, res) => {
      // gtfs.getAgencies((err, agencies) => {
      //   return res.json(agencies);
      // });
      gtfs.getAgencies().then((agencies) => {
        return res.json(agencies);
      }).catch(error => {return res.json(error.message)})
  });

  router.get('/agencies/:agency_id', async (req, res) => {
    const { agency_id } = req.params;
   
    gtfs.getAgencies(req.params)
    .then(agency => {
      return res.json(agency);
    }).catch(error => {
      return res.json(error.message);
    })
  });

  
  router.get('/stops', async (req, res) => {
    const query = {}

    gtfs.getStops(query).then(stops => {
      res.json(stops)
    })

  });

  router.put('/stops',  (req,res,next) => {
    //console.log(req.body)
    gtfs.updateStops(req.body).then(stops => {
      res.json({message: "update success"})
    })

  })


  router.post('/stops',  (req,res,next) => {
    //console.log(req.body)
    gtfs.createStops(req.body).then(stops => {
      res.json({message: "update success"})
    })

  })
  router.delete('/stops/:data',  (req,res,next) => {
    const { data } = req.params;
    console.log("delete stop", data)
    gtfs.deleteStops(data).then(stops => {
      res.json({message: "delete success"})
    })

  })


  router.get('/stops', async (req, res) => {
    const {agency_key} = req.params
    const query = {agency_key: agency_key}

    gtfs.getStops(query).then(stops => {
      res.json(stops)
    })

  });

  router.get('/routes', async (req, res) => {
    gtfs.getRoutes((err, routes) => {
      return res.json(routes);
    });
  });

  router.get('/routesbasic', async (req, res) => {
    //console.log('xxxx')
    gtfs.getRoutesBasic((err, routes) => {
      return res.json(routes);
    });
  });


  router.get('/trips', async (req, res) => {
    gtfs.getTrips((err, trips) => {
      return res.json(trips);
    });
  });

  router.get('/stop_times/:agency_key', async (req, res) => {

    gtfs.getStopTimes((err, stop_times) => {
      return res.json(stop_times);
    });

  });



  router.get('/calendars', async (req, res) => {
    gtfs.getCalendars((err, calendar) => {
      return res.json(calendar);
    });
  });

  router.get('/getroutebyagency/:agency_key', async (req, res) => {
    const { agency_key } = req.params;
    gtfs.getRoutesByAgency(agency_key, (err, routes) => {
      return res.json(routes);
    });
  });

  router.get('/getroutebyid/:agency_key/:route_id', async (req, res) => {
    const { agency_key,route_id } = req.params;
    gtfs.getRoutesById(agency_key, route_id,  (err, routes) => {
      return res.json(routes);
    });
  });

  router.post('/simulate',  (req,res,next) => {
    // console.log("128...at post /simulate", req.body)
    io.sockets.emit('gtfsrt', req.body)
    return res.status(200).json(req.body);

  })

  router.post('/simulate_realtime',  (req,res,next) => {
    //console.log(req.body)
    io.sockets.emit('gtfsrt_realtime', req.body);
    return res.status(200).json(req.body);

  })
  router.post('/passenger_backup',  (req,res,next) => {
    console.log(req.body)
    io.sockets.emit('passenger', req.body);
    return res.status(200).json(req.body);

  })

  router.get('/stopwithroutes', async (req, res) => {
    const stops = gtfs.getRoutesById();
    res.json(stops);
  });
  // -------------------------------------------------------------
  //http://localhost:3000/api/v2/stoptimes/MRTA_Transit/00011
  router.get("/stoptimes/:agency_key/:route_id", (req, res, next) => {
    const {agency_key,route_id} = req.params
    const query = {agency_key: agency_key, route_id: route_id}
    gtfs.getStoptimes(query).then(stoptimes => {
      res.json(stoptimes)
    })
  })

  router.get('/allstoptimes', (req, res, next) => {
    const query = {}
    gtfs.getallstoptimes(query).then(stoptimes => {
      res.json(stoptimes)
    })
  });
  // http://localhost:3000/api/v2/stoptimes_basic/MRTA_Transit/00316
  router.get('/stoptimes_basic/:agency_key/:trip_id', async (req, res) => {
    const {agency_key,trip_id} = req.params
    const query = {agency_key: agency_key, trip_id: trip_id}
    //console.log(query)
    gtfs.getStoptimesBasic(query).then(stoptimes => {
      res.json(stoptimes)
    })
  });

  //localhost:3000/api/v2/stops/MRTA_Transit/00011
router.get("/stops/:agency_key/:route_id", (req, res, next) => {
  const {agency_key,route_id} = req.params
  const query = {agency_key: agency_key, route_id: route_id}
  gtfs.getStops(query).then(stops => {
    const stopwithroutes = []
    const stoplists= []
    stops.map(s => {
      stoplists.push(s)
    })

    obj = {
      route_id: route_id,
      num_stops: stops.length,
      stops: stoplists
    }

    stopwithroutes.push(obj)
    res.json(stopwithroutes)
  })
})

//localhost:3000/api/v2/stops/MRTA_Transit
router.get("/stops/:agency_key", async (req, res, next) => {
  const {agency_key} = req.params
  const query = {agency_key: agency_key}
  // list route in array
  const routelists = await gtfs.getRoutes(query).then(routes =>{
                      rl = routes.map(r => {
                        return r.route_id
                      })
                      return rl
                    });

  // get route + number_stops + stops
  const contruct = (route_id) => {
    return new Promise((res,rej) => {
      const query = {agency_key: agency_key, route_id: route_id}
      const object = gtfs.getStops(query).then(stops => {
        const stopwithroutes = []
        const stoplists= []
        stops.map(s => {
          stoplists.push(s)
        })

        obj = {
          route_id: route_id,
          num_stops: stops.length,
          stops: stoplists
        }
        return obj
      })
      res(object)
    })
  }

  const promises = routelists.map( async (ele) =>{
    const result = await contruct(ele)
    return new Promise((res, rej) => { res(result)})
  })

  Promise.all(promises)
    .then( results => {
      res.json(results)
    })
})

// localhost:3000/api/v2/routeinfos
router.get("/routeinfos", (req, res, next) => {

  const query = {}
  gtfs.getRouteInfo(query).then(routeinfos => {
    //console.log(routeinfos)
    res.json(routeinfos)
  })
})

// localhost:3000/api/v2/routeinfowithtrip/041921
router.get("/routeinfowithtrip/:trip_id", (req, res, next) => {
  const {trip_id} = req.params
  const query = {trip_id: trip_id}
  //console.log(query)
  gtfs.getRouteInfoWithTrip(query).then(routeinfowithtrip => {
    //console.log(routeinfowithtrip)
    res.json(routeinfowithtrip)
  })
})
  return router
};

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});


router.get("/getallstops", async (req, res, next) => {
  const query = {}
  const groupBygroup = groupBy("group")
  const stops = await gtfs.getStops(query)
  // console.log("254 stops",stops)
  gtfs.getallstops(query).then(stoptimes => {
    
    //results = stoptimes.map(s =>{return {group: s.slice(0,2),station: s}}) 
    results = stoptimes.map(s =>{
      let station_name = ""
      stops.forEach(o => {
        if (o.stop_id === s) {
           station_name = o.stop_name
        }
         
      })
      return {group: s.replace(/\d+|^\s+|\s+$/g,''),station: s, name: station_name }})
    grouped = groupBygroup(results)
    // console.log(grouped)
    res.json(grouped)
  })
});
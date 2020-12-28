const moment = require('moment');
const _ = require('lodash');
const calendar = require('./getCalendar');
//const fetch = require('node-fetch');

const path = require('../path/path')

exports.TrainSimulator = class {

  // pass controller gtfs query to db
  constructor(gtfs) {
    this.gtfs = gtfs
  }

  getfileFromConfig(route_id, config) {

    const index = config.findIndex((path, index) => {
      return path.route_id === route_id
    })
    //console.log('index of ',route_id,index)
    return index
  }


  async main() {
    const mmt = moment();
    const mmtMidnight = mmt.clone().startOf('day');
    const diffSeconds = mmt.diff(mmtMidnight, 'seconds');

    const routeinfo = await this.trainAdvance(diffSeconds)
    this.routeinfo = routeinfo
  }

  get trip_gtfs() {
    if ( this.routeinfo  == 0) {
      return [];
    }
     return this.routeinfo;
  }

  async trainAdvance(now) {

    function getsecond(time) {
      const seconds = moment(time, 'HH:mm:ss: A').diff(moment().startOf('day'), 'seconds');
      return seconds
    }

    // find active trip
    function checktime(trip, start_time, endtime_time) {
      const format = 'hh:mm:ss'

      //const CurrentDate = moment().subtract(3,'// const calendar = require('../../process/getCalendar');// const calendar = require('../../process/getCalendar');s');
      const CurrentDate = moment()

      let timenow = CurrentDate.format("HH:mm:ss")
      //let timenow = "10:10:10"
      trip.time_now = timenow
      trip.time_now_sec = getsecond(timenow)
      const time = moment(timenow, format)
      const at = moment(start_time, format)
      const dt = moment(endtime_time, format)

      if (time.isBetween(at, dt)) {
        return true
      } else {
        return false
      }
    }

    // find path
    function getPathfile(trip) {
      // console.log("71..trip id...", trip.trip_id)
      // console.log("71..trip direction.............", trip.direction)


      const index = path.config.findIndex(c => {
        // console.log("73.......", c )
        // console.log("73.........................", c.direction)
        return (c.route_name == trip.route_name && c.direction == trip.direction )
      })

      if (index > -1) {
        // console.log("80",path.config[index].file )
        // console.log("80............................")
        return path.config[index].file
      }

    }


    function transformFormat(stoptimes) {
      function convertime(time) {
        let a = time.split(':')
        let s = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
        return s
      }

      function filtertime(stoptimes){
        let options = { hour12: false };
        let d = new Date();
        let n = d.toLocaleTimeString('en-US',options).slice(0,8);
        const result = stoptimes.filter(st => {
          //console.log("103", st.trip_id, st.stop_id, st.arrival_time, "<>" ,n )
          return (convertime(st.arrival_time) > convertime(n))
        })
        console.log("106", result.length)
        console.log("107", result)
        console.log("107", "----------------------------")
        console.log("108", result[0])
        return result[0]
      }
      function timestamp() {
        let options = { hour12: false };
        let d = new Date();
        let n = d.toLocaleTimeString('en-US',options).slice(0,8);
        let a = n.split(':');
        let s = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
        return s
      }

      function diff_arr_timestamp(upcomming_station) {
        let options = { hour12: false };
        let d = new Date();
        let n = d.toLocaleTimeString('en-US',options).slice(0,8);
        // calculate diff time timestame to arrival_time
        let timestamp = convertime(n)
        let difftime =  convertime(upcomming_station.arrival_time) - timestamp
        console.log("125 difftime stopid, index, difftime", upcomming_station.stop_id, difftime)
        //difftime stop difftime BL10 52
        return difftime
      }
      //each trip
      return Promise.all(stoptimes.map(stoptime => {
        // console.log("85...", stoptime)
        // console.log("85......................")
        const route_name = stoptime.route_name
        const time_now = stoptime.time_now
        const tripEntity = `${stoptime.route_name}-${stoptime.trip_id}`
        const headsign = `${stoptime.start_point} to ${stoptime.end_point}`
        const tripId = stoptime.trip_id
        const route_id = stoptime.route_id
        const calendar = stoptime.calendar
        const latitude = stoptime.location.latitude
        const longitude = stoptime.location.longitude

        const start_time_secs = stoptime.start_time_secs
        const end_time_secs = stoptime.end_time_secs
        const time_now_sec = stoptime.time_now_sec
        const start_time = stoptime.start_time
        const end_time = stoptime.end_time
        const direction = stoptime.direction
        const runtime = stoptime.runtime
        const start_point = stoptime.start_point
        const end_point = stoptime.end_point
        const loc_order = stoptime.loc_order
        const stoptimes = stoptime.stoptimes
        const upcoming_st = filtertime(stoptimes)
        const difftime = diff_arr_timestamp(upcoming_st)

        const time_stamp = timestamp()

        const gtfsrt = `
        {
          "header": {
            "gtfs_realtime_version": "2.0",
            "incrementality": "FULL_DATASET",
            "timestamp": "${time_now}",
            "difftime": "${difftime}",
            "route_name": "${route_name}",
            "route_id": "${route_id}",
            "direction": "${direction}",
            "headsign": "${headsign}",
            "runtime": "${runtime}",
            "calendar": "${calendar}",
            "time_stamp": "${time_stamp}"
          },
          "entity": {
            "id": "${tripEntity}",
            "vehicle": {
              "trip": {
                "trip_id": "${tripId}",
                "start_time_secs": "${start_time_secs}",
                "end_time_secs": "${end_time_secs}",
                "time_now_sec": "${time_now_sec}",
                "start_time": "${start_time}",
                "end_time": "${end_time}",
                "start_point": "${start_point}",
                "end_point" : "${end_point}",
                "loc_order" : "${loc_order}"
              },
              "position": {
                "latitude": "${latitude}",
                "longitude": "${longitude}"
              }
            }
          },
          "stoptime": {
            "agency_key": "${upcoming_st.agency_key}",
            "trip_id": "${upcoming_st.trip_id}",
            "arrival_time": "${upcoming_st.arrival_time}",
            "departure_time": "${upcoming_st.departure_time}",
            "stop_id": "${upcoming_st.stop_id}",
            "stop_sequence": "${upcoming_st.stop_sequence}",
            "calendar": "${upcoming_st.calendar}",
            "time_stamp": "${time_stamp}",
            "difftime": "${difftime}"
          }
        }
        `
        // console.log(gtfsrt)
        // console.log("142...............................")
        return JSON.parse(gtfsrt)
      }))
      //return trip_gtfs
    }

    // step 3
    // pattern use async/await  in map
    // find location
    // calculate location from trip start time
    // 1 delta_ reference time from start
    //    |--------------|
    //  start_time      time_now
    // 2 loc_order = % of loc_lenght

    function getStationfile(trip) {
      console.log(trip.route_name, trip.direction)
      const index = path.station.findIndex(c => {
        return (c.route_name == trip.route_name && c.direction == trip.direction )
      })
      if (index > -1) {
        console.log("175 ",index)
        return path.station[3].file
      }
    }

    function addStoptime(gtfs,trips){
      let loc_length;
      let loc_order;
      let location;
      let delta_p;
      let delta_b;
      let filemodule;
      let loc_b;
      let loc_p;
      const blue_length = 46558;
      const purple_length = 20986;
      const mapdistance = 5;

      return Promise.all(trips.map( async trip => {



        // get file
        filemodule = getPathfile(trip)
        //stoptimesfile = getStationfile(trip)
        //console.log(" === 199",stoptimesfile )
        if (trip.route_name === "blue") {
            //loc_length = path[`${filemodule}`].points.length;
            //delta_b = Math.round((delta_t / totaltime) * blue_length);
            //loc_order = Math.round(delta_b / mapdistance)
            //location = path[`${filemodule}`].points[loc_order]
            //trip.file = filemodule
            //trip.location = location
            //trip.loc_order = loc_order
            const totaltime = trip.runtime_secs
            const delta_t = trip.time_now_sec - trip.start_time_secs
            loc_length = path[`${filemodule}`].points.length;
            delta_b = Math.round((delta_t / totaltime) * loc_length);
            location = path[`${filemodule}`].points[delta_b]
            trip.file = filemodule
            trip.location = location

            console.log("== 209", `${filemodule}`,  delta_b, "/", loc_length, totaltime )
          // console.log('== 183', trip.trip_id, trip.route_name, trip.route_id, filemodule, delta_b, blue_length, loc_order );

        } else if (trip.route_name === "purple") {
          const totaltime = trip.runtime_secs
          const delta_t = trip.time_now_sec - trip.start_time_secs
          loc_length = path[`${filemodule}`].points.length
          delta_p = Math.round((delta_t/ totaltime) * loc_length)
          location = path[`${filemodule}`].points[delta_p]
          trip.file = filemodule
          trip.location = location

          console.log("== 218", `${filemodule}`,  trip.trip_id, delta_p, "/", loc_length, totaltime)


          // console.log('== 183', trip.trip_id, trip.route_name, trip.route_id, filemodule, delta_p, purple_length,  loc_order)


        } else {
           console.log('== 183', trip.route_id, "missing routename")
        }


        // trip.file = filemodule
        // trip.location = location
        // trip.loc_order = loc_order

        // add stoptimes
        try {
          const query = {}
          query.trip_id = trip.trip_id
          query.calendar = calendar.gtfsCalendar()
          // console.log("line 176", query)
          // use trip_id query stop_times
          const result = await gtfs.getRouteInfoWithTrip(query)
          // console.log("line 179",query, result[0])

          const format = 'hh:mm:ss'
          // start_time , end_time trip property
          const start_time = result[0].start_time
          const end_time = result[0].end_time
          // get stoptime
          const stoptimes = result[0].stoptimes
          // trip + stoptime
          trip.stoptimes = stoptimes
          // console.log("=== 211", trip.route_id)
          // console.log("=== 212", trip.stoptimes)
          return trip
        } catch (err) {
          return err.toString()
        }
      }))
    } // end addstoptime


    let routeinfos = []
    try {
      const query = {}
      // step 1
      const routeinfos = await this.gtfs.getRouteInfo(query)
      // console.log("199",routeinfos)
      // const routeexclude = routeinfos.filter( trip => {
      //   return ! (trip.trip_id == "PT4" || trip.trip_id == "DEP-PL")
      // })
      // step 2 add sececond
      const c = calendar.gtfsCalendar()
      // console.log(234, c)
      // step 3 find active train  start_time   - now - endtime)

      const routeinfos_now = routeinfos.filter(trip => {

            return checktime(trip, trip.start_time, trip.end_time)
      })

      const routeinfos_addsec = routeinfos_now.filter(trip => c.includes(trip.calendar)).map(trip => {
        console.log("=== 287 trip start_time end_time", trip.trip_id, trip.start_time, trip.end_time)
        trip.start_time_secs = getsecond(trip.start_time)
        trip.end_time_secs = getsecond(trip.end_time)
        trip.runtime_secs = trip.end_time_secs - trip.start_time_secs
        trip.runtime = Math.round(trip.runtime_secs/60)
        //console.log("=== 290  trip_id  runtime_secs  calendar Start/End", trip.trip_id, trip.runtime_secs, trip.calendar, trip.start_time,"/", trip.end_time)

        return trip

      })

      console.log('=== 263  routeinfos.length | routeinfos_now.length | routeinfos_addsec.length ', routeinfos.length, routeinfos_now.length, routeinfos_addsec.length)

      const routeinfos_stoptimes = await addStoptime(this.gtfs, routeinfos_addsec)
      //console.log("=== 266 total number", routeinfos_stoptimes[0].stoptimes)

      const trip_gtfs = await transformFormat(routeinfos_stoptimes)
      return trip_gtfs
    } catch (err) {
      // console.log(err)
      return 0
    }
  }
}

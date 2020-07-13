const _ = require('lodash')
const fs = require('fs')
const csv = require('fast-csv');
const path = require('path')
const os = require('os');
const convert = require('xml-js');
const request = require('request');
const readline = require('readline');


class KmlToShape {

  /**
   * Calculates the distance between two lat, long coordinate pairs
   * @param lat1
   * @param lng1
   * @param lat2
   * @param lng2
   *
   * @return integer 
   */
  getPathLength(lat1, lng1, lat2, lng2) {
    var lat1rads, lat2rads, deltaLat, lat2rads, deltaLng,
      a, c, dist_metre, R;

    // Avoid to return NAN, if finding distance between same lat long.
    if (lat1 == lat2 && lng1 == lng2) {
      return 0;
    }

    //Earth Radius (in metre)
    R = 6371000

    lat1rads = this.degreesToRadians(lat1)
    lat2rads = this.degreesToRadians(lat2)
    deltaLat = this.degreesToRadians((lat2 - lat1))
    deltaLng = this.degreesToRadians((lng2 - lng1))

    a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1rads) * Math.cos(lat2rads) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    dist_metre = R * c;

    if (isNaN(dist_metre)) {
      return 0;
    }

    return dist_metre
  }

  degreesToRadians(degree) {
    return degree * Math.PI / 180;
  }

  radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  /**
   * returns the lat and long of destination point
   * given the start lat, long, aziuth, and distance.
   *
   * @param lat
   * @param lng
   * @param azimuth
   * @param distance
   * @return {*[]}
   */
  _getDestinationLatLong(lat, lng, azimuth, distance_metre) {
    var lat2, lng2, R, brng, d_km, lat1, lng1;

    R = 6378.1 //Radius of the Earth in km

    //Bearing is degrees converted to radians.
    brng = this.degreesToRadians(azimuth);
    d_km = distance_metre / 1000;
    lat1 = this.degreesToRadians(lat)
    lng1 = this.degreesToRadians(lng)

    lat2 = Math.asin(Math.sin(lat1) * Math.cos(d_km / R) +
      Math.cos(lat1) * Math.sin(d_km / R) * Math.cos(brng))
    lng2 = lng1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(d_km / R) * Math.cos(lat1),
        Math.cos(d_km / R) - Math.sin(lat1) * Math.sin(lat2));

    //convert back to degrees
    lat2 = this.radiansToDegrees(lat2)
    lng2 = this.radiansToDegrees(lng2)

    return [parseFloat(lat2.toFixed(6)), parseFloat(lng2.toFixed(6))]
  }

  /**
   * calculates the azimuth in degrees from start point to end point
   *
   * @param lat1
   * @param lng1
   * @param lat2
   * @param lng2
   * @return {*}
   */
  calculateBearing(lat1, lng1, lat2, lng2) {
    var startLat, startLong, endLat, endLong, dLong, dPhi, bearing;

    startLat = this.degreesToRadians(lat1)
    startLong = this.degreesToRadians(lng1)
    endLat = this.degreesToRadians(lat2)
    endLong = this.degreesToRadians(lng2)

    dLong = endLong - startLong
    dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));

    if (Math.abs(dLong) > Math.PI) {
      if (dLong > 0) {
        dLong = -(2.0 * Math.PI - dLong)
      } else {
        dLong = (2.0 * Math.PI + dLong)
      }
    }

    bearing = (this.radiansToDegrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;

    return bearing;
  }

  /**
   * Invoke to returns every coordinate pair in-between two coordinate pairs
   * given the desired interval
   *
   * @param interval
   * @param azimuth
   * @param lat1
   * @param lng1
   * @param lat2
   * @param lng2
   *
   * @return {Array}
   */
  _buildCoordinates(interval, azimuth, lat1, lng1, lat2, lng2) {
    var d, dist, counter, coords, range_list, _coord;

    d = this.getPathLength(lat1, lng1, lat2, lng2);

    dist = parseInt(d / interval);

    coords = [];
    coords.push([lat1, lng1]);
    //:::::::::::::::::::::::::::::::::::::
    //::::: Lodash/UnderScore lib     :::::
    //:::::::::::::::::::::::::::::::::::::
    range_list = _.range(0, dist);

    counter = parseFloat(interval)

    for (var key in range_list) {
      _coord = this._getDestinationLatLong(lat1, lng1, azimuth, counter)
      counter = counter + parseFloat(interval)
      coords.push(_coord);
    }

    coords.push([lat2, lng2])

    return coords;

  }

  /**
   * Invoke to get coordinates between two location
   * @param lat1
   * @param lng1
   * @param lat2
   * @param lng2
   * @param interval_meters
   * @return {Array|*}
   */
  getCoordinates(lat1, lng1, lat2, lng2, interval_meters) {
    var azimuth, coords;

    // point interval in meters
    if (!interval_meters) {
      interval_meters = 20.0
    }

    azimuth = this.calculateBearing(lat1, lng1, lat2, lng2)
    coords = this._buildCoordinates(interval_meters, azimuth, lat1, lng1, lat2, lng2)

    return coords;
  }

  /**
   * Generate getCoordinatesGeoJson  
   * between 2 location
   * @param {*} lat1 
   * @param {*} lng1 
   * @param {*} lat2 
   * @param {*} lng2 
   * @param {*} interval_meters 
   */
  getCoordinatesGeoJson(lat1, lng1, lat2, lng2, interval_meters) {
    // Avoid to return NAN, if finding distance between same lat long.
    if (lat1 == lat2 && lng1 == lng2) {
      return 0;
    }
    var azimuth, coords;

    // point interval in meters
    if (!interval_meters) {
      interval_meters = 20.0
    }

    azimuth = this.calculateBearing(lat1, lng1, lat2, lng2)
    coords = this._buildCoordinates(interval_meters, azimuth, lat1, lng1, lat2, lng2)

    const features = coords.map(cord => ({
      type: 'Feature',
      "properties": {},
      geometry: {
        type: 'Point',
        coordinates: cord
      }
    }));

    return {
      type: 'FeatureCollection',
      features
    }

  }

  /**
   * Create Coordinate
   * @param {*} lat1 
   * @param {*} lng1 
   * @param {*} lat2 
   * @param {*} lng2 
   * @param {*} interval_meters 
   */
  createCoordinate(lat1, lng1, lat2, lng2, interval_meters) {
    // Avoid to return NAN, if finding distance between same lat long.
    // console.log(lat1, lng1, lat2, lng2, interval_meters)
    if (lat1 == lat2 && lng1 == lng2) {
      return 0;
    }
    var azimuth, coords;

    // point interval in meters
    if (!interval_meters) {
      interval_meters = 5.0
    }

    azimuth = this.calculateBearing(parseFloat(lat1), parseFloat(lng1), parseFloat(lat2), parseFloat(lng2))
    coords = this._buildCoordinates(interval_meters, azimuth, parseFloat(lat1), parseFloat(lng1), parseFloat(lat2), parseFloat(lng2))

    return coords
  }

  /**
   * Generate shapes.txt from route kml format
   * @params filename  in kml format
   * @params shapefile output file
   * @return integer 
   */
  generate_shapesfile(filename) {
    // output file in the same folder
    const output = []; // holds all rows of data
    const output_in = [];
    output_in.push("shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled")
    // const FILE = path.join(__dirname, `${filename}`)
    var xml = require('fs').readFileSync(filename, 'utf8');

    var result = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));
    const Placemark = result.kml.Document.Placemark
    console.log(Placemark)
    const name = result.kml.Document.name._text
    console.log(name)

    // remove space replace(/\s/g, '')
    const cords = Placemark.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
    // console.log("281......", cords)
    // a new array for each row of data


    cords.forEach((cord, index) => {
      const location = [];
      const cord_arr = cord.split("/")
      location.push(cord_arr[0])
      location.push(cord_arr[1])
      output.push(location)
    });

    let output_intervals = []
    output.forEach((location, index) => {
      if (index == 0) {
        //console.log("skip 0")
        return 0
      }
      // every 10 meters
      const cordinates = this.createCoordinate(location[1], location[0], output[index - 1][1], output[index - 1][0], 10)
      // console.log(cordinates)
      output_intervals = output_intervals.concat(cordinates)
      // console.log(output_intervals)
    });

    output_intervals.map((cord, index) => {

      const row = []
      if (! isNaN(cord[1])) {
        row.push(name)
        row.push(cord[0])
        row.push(cord[1])
        row.push(index)
        row.push(index*10)
        output_in.push(row.join()); // by default, join() uses a ','
      }

    });

    // console.log("318",output_in)
    // fs.writeFileSync(shapefile, output.join(os.EOL));
    return output_in.join(os.EOL)
  }

  isArray(obj) {
    return !!obj && obj.constructor === Array;
  }
  /**
   * Generate geojson from kmlfile
   * @params filename  
   *  
   */
  generate_geojson(filename) {
    // const FILE = path.join(__dirname, `${filename}`)
    var xml = require('fs').readFileSync(filename, 'utf8');
    const output = []
    var result = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));
    const Placemark = result.kml.Document.Placemark
    let cords = []
    // console.log("314", Placemark)
    // console.log("315", this.isArray(Placemark))
    if (this.isArray(Placemark)) {
      Placemark.forEach(place => {
        let subcords = place.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
        cords = cords.concat(subcords)
      })
    } else {
      const name = result.kml.Document.name._text
      cords = Placemark.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
    }
    
    // console.log(name)

    // remove space replace(/\s/g, '')
   
    console.log("330", cords)

    cords.forEach((cord, index) => {
      const location = [];
      const cord_arr = cord.split("/")
      // console.log("longitude", cord_arr[0])
      // console.log("latitude", cord_arr[1])
      location.push(cord_arr[0])
      location.push(cord_arr[1])
      output.push(location)
    });
    //console.log(output)
    // console.log("342 kml_to_shape.js",output.length)
    let output_intervals = []
    output.forEach((location, index) => {
      if (index == 0) {
        //console.log("skip 0")
        return 0
      }
      // every 10 meters
      const cordinates = this.createCoordinate(location[1], location[0], output[index - 1][1], output[index - 1][0], 10)
      // console.log(cordinates)
      output_intervals = output_intervals.concat(cordinates)
      // console.log(output_intervals)
    });

    //console.log(output_intervals.length)

    const features = output_intervals.map(cord => ({
      type: 'Feature',
      "properties": {},
      geometry: {
        type: 'Point',
        coordinates: [cord[1], cord[0]]
      }
    }));
    return {
      type: 'FeatureCollection',
      features
    }
  }

  /**
   * Generate geojson from kmlfile
   * @params filename  
   *  
   */
  generate_geojsonLine(filename) {
    // const FILE = path.join(__dirname, `${filename}`)
    var xml = require('fs').readFileSync(filename, 'utf8');
    const output = []
    var result = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));
    const Placemark = result.kml.Document.Placemark
    let cords = []

    if (this.isArray(Placemark)) {
      Placemark.forEach(place => {
        let subcords = place.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
        cords = cords.concat(subcords)
      })
    } else {
      const name = result.kml.Document.name._text
      cords = Placemark.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
    }

    // console.log("395", cords)
    cords.forEach((cord, index) => {
      const location = [];
      const cord_arr = cord.split("/")
      // console.log("longitude", cord_arr[0])
      // console.log("latitude", cord_arr[1])
      location.push(cord_arr[0])
      location.push(cord_arr[1])
      output.push(location)
    });
    //console.log(output)
    //console.log(output.length)
    let output_intervals = []
    output.forEach((location, index) => {
      if (index == 0) {
        //console.log("skip 0")
        return 0
      }
      const cordinates = [location[0], location[1]]
      // console.log("391", cordinates)
      output_intervals = output_intervals.concat([cordinates])
      
    });

    // console.log(output)

    let coordinates = output.map(cord => {
      return [parseFloat(cord[0]), parseFloat(cord[1])]
    })

    const features = {
      type: 'Feature',
      "properties": {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    }


    return {
      type: 'FeatureCollection',
      features: [ features ]
    }

  }


  generate_path_in(filename) {

    // const FILE = path.join(__dirname, `${filename}`)
    var xml = require('fs').readFileSync(filename, 'utf8');
    const output = []
    var result = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));
    const Placemark = result.kml.Document.Placemark
    let cords = []
    // console.log("314", Placemark)
    // console.log("315", this.isArray(Placemark))
    if (this.isArray(Placemark)) {
      Placemark.forEach(place => {
        let subcords = place.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
        cords = cords.concat(subcords)
      })
    } else {
      const name = result.kml.Document.name._text
      cords = Placemark.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
    }
    
    // console.log(name)

    // remove space replace(/\s/g, '')
   
    console.log("330", cords)

    cords.forEach((cord, index) => {
      const location = [];
      const cord_arr = cord.split("/")
      // console.log("longitude", cord_arr[0])
      // console.log("latitude", cord_arr[1])
      location.push(cord_arr[0])
      location.push(cord_arr[1])
      output.push(location)
    });
    //console.log(output)
    // console.log("342 kml_to_shape.js",output.length)
    let output_intervals = []
    output.forEach((location, index) => {
      if (index == 0) {
        //console.log("skip 0")
        return 0
      }
      // every 10 meters
      const cordinates = this.createCoordinate(location[1], location[0], output[index - 1][1], output[index - 1][0], 10)
      // console.log(cordinates)
      output_intervals = output_intervals.concat(cordinates)
      // console.log(output_intervals)
    });

    //console.log(output_intervals.length)

    const features = output_intervals.map((cord,index)=> ({
        index: index,
        latitude: cord[0].toString(),
        longitude: cord[1].toString()
      
    }));
    return {
      "path": {
        "name": "name",
        "direction": "direction"
      },
      points: features
    }
  }
  generate_path_out(filename) {
         // const FILE = path.join(__dirname, `${filename}`)
    var xml = require('fs').readFileSync(filename, 'utf8');
    const output = []
    var result = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));
    const Placemark = result.kml.Document.Placemark
    let cords = []
    // console.log("314", Placemark)
    // console.log("315", this.isArray(Placemark))
    if (this.isArray(Placemark)) {
      Placemark.forEach(place => {
        let subcords = place.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
        cords = cords.concat(subcords)
      })
    } else {
      const name = result.kml.Document.name._text
      cords = Placemark.LineString.coordinates._text.trim().replace(/\r?\n?/g, '').replace(/,/g, "/").split(/\s+/)
    }
    
    // console.log(name)

    // remove space replace(/\s/g, '')
   
    console.log("330", cords)

    cords.forEach((cord, index) => {
      const location = [];
      const cord_arr = cord.split("/")
      // console.log("longitude", cord_arr[0])
      // console.log("latitude", cord_arr[1])
      location.push(cord_arr[0])
      location.push(cord_arr[1])
      output.push(location)
    });
    //console.log(output)
    // console.log("342 kml_to_shape.js",output.length)
    let output_intervals = []
    output.forEach((location, index) => {
      if (index == 0) {
        //console.log("skip 0")
        return 0
      }
      // every 10 meters
      const cordinates = this.createCoordinate(location[1], location[0], output[index - 1][1], output[index - 1][0], 10)
      // console.log(cordinates)
      output_intervals = output_intervals.concat(cordinates)
      // console.log(output_intervals)
    });

    //console.log(output_intervals.length)

    const features = output_intervals.reverse().map((cord,index)=> ({
      
        index: index,
        latitude: cord[0].toString(),
        longitude: cord[1].toString()
    }));
    return {
      "path": {
        "name": "name",
        "direction": "direction"
      },
      points: features
    }  
  }
}

module.exports = KmlToShape
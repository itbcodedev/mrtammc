/**
 * All lat-long specific operation define here
 *
 * http://www.movable-type.co.uk/scripts/latlong.html
 * Original: https://gis.stackexchange.com/a/265626
 * Updated: Jackdh
 */

const _ = require('lodash');

class LatLong {

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

}


module.exports = LatLong;
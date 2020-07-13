/// <reference types="@types/googlemaps" />
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GtfsService } from '../../services/gtfs.service';

import { Stop } from '../../models/stop.model';
import { Agency } from '../../models/agency.model';
import { Route } from '../../models/route.model';
import { Trip } from '../../models/trip.model';
import { Calendar } from '../../models/calendar.model';
import { Shape } from '../../models/shape.model';
import { ShapeDetail } from '../../models/shape_detail';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';

import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss']
})

export class GooglemapComponent implements OnInit, AfterViewInit {
  icon = environment.icon;
  @ViewChild('gmapRef', { static: false }) mapRef: ElementRef;
  @ViewChild('map_popup', { static: false }) map_popupRef: ElementRef;
  gmapContainer: google.maps.Map;
  markers: google.maps.Marker[] = [];
  movetrains: google.maps.Marker[] = [];
  lasttrains: google.maps.Marker[] = [];
  tripPath: google.maps.Polyline;
  agencies: Agency[] = [];
  routes: Route[] = [];
  stopslist: any = [];
  selectedRoute: Route;
  selectedTrip: Trip;
  trips: Trip[] = [];
  stops: Stop[];
  trains: Stop[];
  shapes: Shape[];
  polylines: google.maps.Polyline[] = [];
  tripMarkers: google.maps.Marker[] = [];
  ttm: number;
  today: string;
  zoom: Number = 10;
  maptype: String = 'terrain';
  activeTrains: any;
  myTrains: any;
  newTrains: any;
  shapeMap = new Map();
  directionsService: google.maps.DirectionsService;
  directionsDisplay: google.maps.DirectionsRenderer;
  // initial center position for the map
  lat: Number = 13.819806;
  lng: Number = 100.533742;
  trainMakers = [];
  notfollow = true;
  selectedtrain: any;  //folow train
  mapstyles: google.maps.MapTypeStyle[] = [
    {
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#f5f5f5'
        }
      ]
    },
    {
      'elementType': 'labels.icon',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#cfc8c0'
        }
      ]
    },
    {
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#f5f5f5'
        }
      ]
    },
    {
      'featureType': 'administrative.land_parcel',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#bdbdbd'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#eeeeee'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#757575'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#e5e5e5'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9e9e9e'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#ffffff'
        }
      ]
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#757575'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#dadada'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#616161'
        }
      ]
    },
    {
      'featureType': 'road.local',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9e9e9e'
        }
      ]
    },
    {
      'featureType': 'transit.line',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#e5e5e5'
        }
      ]
    },
    {
      'featureType': 'transit.station',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#eeeeee'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#c9c9c9'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9e9e9e'
        }
      ]
    }
  ];


  constructor(private gtfsService: GtfsService,
    @Inject(DOCUMENT) document) {
    setInterval(() => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timezone: 'Asia/Bangkok' };
      const currentDate = new Date();
      this.today = currentDate.toLocaleDateString('th-TH', options) + ' ' + currentDate.toLocaleTimeString();
      // const Secs = +currentDate.getHours() * 3600 + +currentDate.getMinutes() * 60 + +currentDate.getSeconds();
      const Secs = +currentDate.getHours() * 3600 + +currentDate.getMinutes() * 60 + +currentDate.getSeconds();
      this.ttm = Secs;
    }, 1000);
  }

  async ngOnInit() {

    $(document).ready(() => {
      const trees: any = $('[data-widget="treeview"]');
      trees.tree();
    });

    this.agencies = await this.gtfsService.getAgencies();
    this.stops = await this.gtfsService.getStops();
    this.getstopwithroutes();
    this.getRoutes('MRTA_Transit');
    this.getStation();
    this.getShapes();

    setInterval(async () => {
      // find  active train
      this.activeTrains = await this.promise_getTrain(this.timeToMidnight());

      // select view
      if (this.notfollow == true) {
        this.myTrains = await this.moveTrain(this.timeToMidnight());
        // console.log(this.myTrains);
      } else {
        await this.singletrip(this.timeToMidnight())
      }

      await this.gtfsService.updateActiveTrains(this.myTrains)
        .subscribe(data => data);

    }, 2000);

  }

  timeToMidnight() {
    const time = new Date();
    const secs = +time.getHours() * 3600 + +time.getMinutes() * 60 + +time.getSeconds();
    //const secs = 20 * 3600 + +time.getMinutes() * 60 + +time.getSeconds();
    return secs;
  }

  ngAfterViewInit() {
    const options = {
      center: new google.maps.LatLng(13.843180, 100.487147),
      zoom: 12,
      styles: this.mapstyles,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      fullscreenControl: true
    };

    this.gmapContainer = new google.maps.Map(
      this.mapRef.nativeElement,
      options
    );
  }

  onAgencyChange(event) {
    const agencyId = event.target.value;
    this.selectedRoute = null;
    this.getRoutes(agencyId);
  }

  onRouteClick(event, route) {
    event.preventDefault();
    this.selectedRoute = route;
    this.getTrips(route.routeId);
  }

  async selectRoute(event) {
    let lines = [
      {"00011": "shp_16"},
      {"00012": "shp_16"},
      {"00013": "shp_03"},
      {"00014": "shp_04"},
      {"00015": "shp_16"},
      {"00016": "shp_16"},
      {"00017": "shp_16"},
      {"00018": "shp_16"},

    ]




    if (event.target.checked) {
      let routeid = event.target.value;
      try {
        let trips: Trip[] = await this.gtfsService.getTripByRoute(routeid);
        let shapeid = trips[0].shapeId;
        this.getShapesbyId(shapeid);
      } catch (e) {
        console.log('error');
      }
      this.getShapesbyId(routeid);
    } else {
      this.getShapes();
    }
  }

  async onTripClick(event, trip) {
    event.preventDefault();
    this.selectedTrip = trip;
    this.getStops(trip.tripId);
  }


  async getStops(tripId: string) {
    const stops: Stop[] = await this.gtfsService.getStopByTrip(tripId);
    this.stops = stops;
    this.importStopToMap(stops);
  }

  importStopToMap(stops: Stop[]) {
    this.clearMarkers();
    const coordinates = [];

    for (const stop of stops) {
      const icon = {
        station: {
          url: environment.iconbase + stop.icon, // url
          scaledSize: new google.maps.Size(18, 18), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(8, 8) // anchor
        }
      };
      const position = new google.maps.LatLng(stop.stopLat, stop.stopLon);
      const marker = new google.maps.Marker({
        position,
        icon: icon.station,
        map: this.gmapContainer
      });
      marker.addListener('click', () =>
        this.onMarkerClick(this.gmapContainer, marker, stop)
      );
      coordinates.push(position);
      this.markers.push(marker);
    }
  }

  async showstations(stops: Stop[]) {
    let stoptimebystops: any;
    let nexttrips: any;
    this.clearMarkers();
    const coordinates = [];
    for (const stop of stops) {
      // prepare data
      stoptimebystops = await this.gtfsService.getStopTimesByStop(stop.stopId);
      // [] = 0
      // console.log(stoptimebystops);
      if (stoptimebystops.length == 0) {
        let direction = "Maintain"
      } else {
        nexttrips = stoptimebystops.find(x => this.calsecs(x.arrivalTime) > this.timeToMidnight());
        if (+nexttrips.directionId == 0) {
          let direction = "ขาเข้า"
        }

        if (+nexttrips.directionId == 1) {
          let direction = "ขาออก"
        }
      }


      const icon = {
        station: {
          url: environment.iconbase + stop.icon, // url
          scaledSize: new google.maps.Size(24, 21), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(8, 8) // anchor
        }
      };
      console.log('417 nexttrips', nexttrips)

      const contentstring = `
         <div class="card" style="width: 18rem;">
           <img class="card-img-top" src="${stop.stopUrl}" alt="Card image cap">
           <div class="card-body">
             <span class="badge badge-secondary">สถานี ${stop.stopId} ${stop.stopName}</span>
             <p class="card-text">
             <i class="fa fa-map-marker" aria-hidden="true"></i>
             <span> ละติจูด ${stop.stopLat}  ลองจิจูด ${stop.stopLon}</span>
             </p>

             <button type="button" class="btn btn-primary btn-sm" style="padding: 0.25rem 0.2rem; font-size: 0.75rem;">
             ${nexttrips.tripId} - ${nexttrips.tripHeadsign} @ เข้า ${nexttrips.arrivalTime} ออก ${nexttrips.departureTime}
             </button>
          </div>
        </div>
      `;
      const infowindow = new google.maps.InfoWindow({
        content: contentstring
      });

      const position = new google.maps.LatLng(stop.stopLat, stop.stopLon);
      const marker = new google.maps.Marker({
        position,
        icon: icon.station,
        map: this.gmapContainer
      });
      marker.addListener('click', () =>
        infowindow.open(this.gmapContainer, marker)
      );
      coordinates.push(position);
      this.markers.push(marker);
    }
  }
  async onMarkerClick(onmap, marker, stop) {
    const calendar: Calendar = await this.gtfsService.getCalendarByService(
      this.selectedTrip.serviceId
    );

    const stopsTimes: Stop[] = await this.gtfsService.getStopByTrip(stop.tripId);
    let scheduler = '';
    for (const stopTime of stopsTimes) {
      scheduler += `
      <tr>
        <td>${stopTime.arrivalTime}</td>
        <td>(${stopTime.stopId}) ${stopTime.stopName}</td>
      </tr>
      `;
    }

    const table = `
    <table class="table table-sm">
      <thead>
        <tr>
        <th>Arrival Time</th>
        <th>Destination Name</th>
        </tr>
      </thead>
      <tbody>
        ${scheduler}
      </tbody>
    </table>`;

    const contentString = `
    <div  style="height: 220px;">
      <div class="header">
        <h6>Stop Name: ${stop.stopName} <br/> <i class="fa fa-train" aria-hidden="true"></i>
         Trip Id: ${stop.tripId}</h6>
        ${
      stop.stopSequence > 1
        ? `<div>Arrival Time: ${stop.arrivalTime}</div>`
        : `<div>Depature Time: ${stop.departureTime}</div>`
      }
      </div>
      <div class="service-availability">
        Days :
        <span ${+calendar.Sunday ? 'class="available"' : ''} >S</span>
        <span ${+calendar.Monday ? 'class="available"' : ''} >M</span>
        <span ${+calendar.Tuesday ? 'class="available"' : ''} >T</span>
        <span ${+calendar.Wednesday ? 'class="available"' : ''} >W</span>
        <span ${+calendar.Thursday ? 'class="available"' : ''} >T</span>
        <span ${+calendar.Friday ? 'class="available"' : ''} >F</span>
        <span ${+calendar.Saturday ? 'class="available"' : ''} >S</span>
      </div>
        Calendar: ${calendar.serviceId}
      <br/>
      ${stopsTimes.length > 0 ? table : ''}
    </div>
    `;

    const infowindow = new google.maps.InfoWindow({
      content: contentString.trim(),
      maxWidth: 300
    });

    infowindow.open(onmap, marker);
  }

  async getRoutes(agencyId: string) {
    const routes = await this.gtfsService.getRoutesByAgency(agencyId);
    this.routes = routes;
  }

  async getstopwithroutes() {
    const stopslist = await this.gtfsService.getstopwithroutes();
    //console.log(stopslist);
    this.stopslist = stopslist;
  }


  async getTrips(routeId: string) {
    try {
      const trips: Trip[] = await this.gtfsService.getTripByRoute(routeId);
      this.trips = trips;
    } catch (e) {
      //console.log('error');
    }
  }

  async getStation() {
    const stations: Stop[] = await this.gtfsService.getStops();
    //console.log(stations);
    this.showstations(stations);
  }

  async promise_getTrain(secs: number) {
    return new Promise(async (resolve, reject) => {
      const stopslists = await this.gtfsService.getstopwithroutes();

      let stationA: any;
      let stationB: any;
      for (let i = 0; i < stopslists.length; i++) {
        //console.log(`${stopslists[i].route}  routename ${stopslists[i].routename} `);
        const stops = stopslists[i].stops;
        if (stops.length > 0) {
          stationA = stops[0].stopid;      //first station
          stationB = stops[stops.length - 1].stopid; // last station
        }

      }
      const activeTrains = [];
      // get data from api
      const trips = await this.gtfsService.getTrips().then((trip) => trip);
      const stop_times = await this.gtfsService.getStopTimes().then((stop_time => stop_time));
      //console.log('560 -----', stop_times.length)
      const grouped = this.groupBy(stop_times, stop => stop.tripId);

      grouped.forEach((values, key) => {
        //console.log('565--------',key, values.length, values);
        const selectedTrain = [];
        const selectTrips = [];
        const trains = [];

        for (const trip of values) {
          //if (trip.stopId === stationA || trip.stopId === stationB) {
            selectTrips.push(trip);
          //}
        }

        //console.log('575--------',key, selectTrips.length, selectTrips);
        // create train info object
        if (selectTrips !== undefined) {
          for (let i = 0; i < selectTrips.length; i += 2) {
            if ((selectTrips[i + 1])) {
              const trip_tripid = trips.find(trip => trip.tripId === selectTrips[i].tripId);

              if (trip_tripid !== undefined) {

                const shape = trip_tripid.shapeId;
                const object = Object.assign({}, {
                  stop_idA: `${selectTrips[i].stopId}`,
                  stop_idB: `${selectTrips[i + 1].stopId}`,
                  trip_id: `${selectTrips[i].tripId}`,
                  shape_id: `${shape}`,
                  direction_id: `${trip_tripid.directionId}`,
                  arrival_secs: `${selectTrips[i].arrivalSecs}`,
                  departure_secs: `${selectTrips[i + 1].departureSecs}`,
                  arrival_time: `${selectTrips[i].arrivalTime}`,
                  departure_time: `${selectTrips[i + 1].departureTime}`
                });
                trains.push(object);  // get train
              } else {

              }
            }
          }
        } else {
          console.log("")
        }

        const isActiveTrain = (t: any) => {    // test train
          if ((secs >= t.arrival_secs) && (secs < t.departure_secs)) {
            return true;
          } else {
            return false;
          }
        };
        //console.log('611 ---- trains.length', trains.length)
        for (let i = 0; i < trains.length; i++) {
          if (isActiveTrain(trains[i])) {
            if (trains[i]) {
              activeTrains.push(trains[i]);
            }
          }
        }
        resolve(activeTrains);
      });
    });
  }

  calsecs(time: string) {
    let tt = time.split(":");
    let sec = +tt[0] * 3600 + +tt[1] * 60 + +tt[2] * 1;
    return sec
  }

  async totoaltrip() {

  }

  async moveTrain(secs: number) {

    //this.lasttrains.forEach((ltrain)=>{
    //  if (ltrain.getMap()) {
    //    ltrain.setMap(null)
    //    ltrain.setVisible(false)
    //  }
    //})
    this.movetrains = [];
    this.trainMakers = [];
    let next_station = "";
    let at_time = "";
    let next_stoptime: any;
    let heading: any;
    let tripdirection: any;
    let trains = this.activeTrains;
    //console.log(trains);
    let shape: any;
    let trip: any;
    let stops: any;
    let trips = await this.gtfsService.getTrips().then((trip) => trip);
    let stopslists = await this.gtfsService.getstopwithroutes();
    let stopswithtrip: any;
    let markers = [];
    let spherical = google.maps.geometry.spherical;
    // calculate distance
    for (let i = 0; i < trains.length; i++) {
      trains[i].density = Math.floor((Math.random() * 10) + 1);
      shape = trains[i].shape_id;
      let polyline = this.shapeMap.get(shape);
      // pull trip info
      trip = trips.find(x => x.tripId == trains[i].trip_id);
      stops = stopslists.find(x => x.route == trip.routeId).stops;
      stopswithtrip = await this.gtfsService.getStopTimesByTrip(trains[i].trip_id);

      // for mantainance trip no stoptime data
      if (stopswithtrip === undefined || stopswithtrip.length == 0) {
        next_station = "Maintainance";
        at_time = "00:00:00";

      } else {

        next_stoptime = stopswithtrip.find(x => this.calsecs(x.arrivalTime) > this.timeToMidnight());
        let next_stop = stops.find(x => x.stopid == next_stoptime.stopId)
        //console.log('680  next_stop---------', next_stop);
        if ( next_stop !== undefined) {
           next_station = next_stop.stopname;
        }
        at_time = next_stoptime.arrivalTime;
      }


      const polyLengthMeters = spherical.computeLength(polyline.getPath());

      const total_diff_time = trains[i].departure_secs - trains[i].arrival_secs;
      // 0 = inbound  diff from station A, 1 = outbound diff from station B
      const direction = trains[i].direction_id;
      let diff_time = 0;
      let diff_distance = 0;

      // console.log(`id ${trains[i].trip_id}  direction_id ${direction}`);
      //  +departure_sec +---diff------+sec---------+
      // convert time --> distance --> latlng
      if (direction == true) {  // outbound
        // count from right
        diff_time = trains[i].departure_secs - secs;
        diff_distance = (polyLengthMeters * diff_time) / total_diff_time;
      }
      if (direction == false) { // inbound
        // count from left
        diff_time = secs - trains[i].arrival_secs;
        diff_distance = (polyLengthMeters * diff_time) / total_diff_time;

      }
      // const startlatlng = polyline.getPath().getAt(0);

      const startlatlng = polyline.GetPointAtDistance(diff_distance);
      trains[i].startlatlng = startlatlng;
      trains[i].next_station = next_station;
      trains[i].at_time = at_time;
      // set icon direction by -10 meters
      const lastPosn = polyline.GetPointAtDistance(diff_distance - 10);
      const markerLabel = trains[i].trip_id;

      // set direction in/out trip
      if (direction == true) {  // outbound
        heading = google.maps.geometry.spherical.computeHeading(lastPosn, startlatlng);
        // rotate 180 degree
        heading = heading - 180;
        tripdirection = 'ขาออก';
        trains[i].heading = heading;
        trains[i].tripdirection = tripdirection;
      }
      if (direction == false) { // inbound
        heading = google.maps.geometry.spherical.computeHeading(lastPosn, startlatlng);
        tripdirection = 'ขาเข้า';
        trains[i].heading = heading;
        trains[i].tripdirection = tripdirection;
      }
      //console.log(trains[i]);
      const trainicon = {
        path: this.icon,
        scale: 0.4,
        strokeColor: '#fff',
        strokeWeight: 2,
        fillOpacity: 1,
        fillColor: '#E74C3C',
        anchor: new google.maps.Point(32, 32),
        rotation: heading
      };

      // set infobox marker
      let density = "";
      for (let j = 0; j < trains[i].density; j++) {
        density += '<span ><img src="assets/dist/icons/man.png" /></span>';
      }
      const content = `
       <div class="info-window">
          <span class="fa-stack fa-lg">
            <i class="fa fa-circle fa-stack-2x"></i>
            <i class="fa fa-train fa-stack-1x fa-inverse"></i>
          </span>
          <span class="badge badge-danger"> ${markerLabel}</span><span> ทิศทาง ${tripdirection}</span>
          <p> เส้นทาง ${trains[i].stop_idA} - ${trains[i].stop_idB} </p>
          <div class="alert alert-light">
              <p> <b> ความหนาแน่น ${trains[i].density * 10} % </b> </p>
              ${density}
          </div>

        </div>
       `;

      markers[i] = this.createMarker(startlatlng, markerLabel, content);
      markers[i].setIcon(trainicon);
      //console.log(`search marker ${markers[i].getTitle()}`)
      let foundMarker = this.isExistMarker(markers[i]);
      // console.log(typeof foundMarker);
      // console.log(foundMarker);
      if (foundMarker != null) {
        //set map if marker in lasttrain
        // console.log(">>> set maker on  map if marker in lasttrain")
        foundMarker.setMap(this.gmapContainer);
        foundMarker.setPosition(markers[i].getPosition())
        foundMarker.setVisible(true);

      } else {
        //add marker to lastrain
        console.log(">>> add marker to lastrain")
        markers[i].setMap(null);
        this.lasttrains.push(markers[i])
      }
      //set global data
      this.movetrains.push(markers[i]);
      this.trainMakers.push({ trip_id: trains[i].trip_id, marker: markers[i] });
    }
    //this.lasttrains = this.movetrains;
    return trains;
  }

  isExistMarker(marker: google.maps.Marker) {
    for (var i = 0; i < this.lasttrains.length; i++) {
      if (this.lasttrains[i]['title'] === marker.getTitle()) {
        return this.lasttrains[i];
      }
    }
    return null;
  }

  async getShapes() {
    const shapes: Shape[] = await this.gtfsService.getShapes();
    const shape_details: ShapeDetail[] = await this.gtfsService.getShapeDetail();
    this.shapes = shapes;
    //console.log(this.shapes);
    // groupBy is
    const grouped = this.groupBy(shapes, (shape: any) => shape.shapeId);
    //console.log(grouped);
    grouped.forEach((values, key) => {
      const color = shape_details.find(shape_detail => shape_detail.shape_id === key).color;
      const coordinates = [];
      for (const shape of values) {
        const position = new google.maps.LatLng(shape.shape_pt_lat, shape.shape_pt_lon);
        coordinates.push(position);
      }
      this.tripPath = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: `#${color}`,
        strokeOpacity: 1.0,
        strokeWeight: 4
      });
      this.tripPath.setMap(this.gmapContainer);
      this.polylines.push(this.tripPath);
      this.shapeMap.set(key, this.tripPath);
    });
  }

  async getShapesbyId(shapeid) {
    const shapes: Shape[] = await this.gtfsService.getShapes();

    this.shapes = shapes;
    //console.log(this.shapes);
    // groupBy is
    const grouped = this.groupBy(shapes, (shape: any) => shape.shapeId);
    if (grouped.get(shapeid) != undefined) {
      let shape = grouped.get(shapeid);
      const coordinates = [];
      shape.forEach((s) => {
        const position = new google.maps.LatLng(s.shapePtLat, s.shapePtLon);
        coordinates.push(position);
      })

      this.shapeMap.forEach((sm) => { sm.setMap(null) });

      this.tripPath = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: '#7C3592',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });

      this.tripPath.setMap(this.gmapContainer);
      this.polylines.push(this.tripPath);
      this.shapeMap.set(shapeid, this.tripPath);
    }
  }


  async getStopTimes() {
    const stop_times = await this.gtfsService.getStopTimes();
    //console.log(stop_times);
  }

  // clear marker
  clearMarkers() {
    if (this.tripPath) {
      this.tripPath.setMap(null);
    }

    for (const marker of this.markers) {
      marker.setMap(null);
    }
  }

  gettrainmarker(train: any) {
    //console.log(train.trip_id);
    //console.log(this.trainMakers);
    let obj = this.trainMakers.find(x => x.trip_id == train.trip_id);
    // console.log(obj.marker);
    google.maps.event.trigger(obj.marker, 'click');

  }
  // create Maker
  createMarker(latlng, label, html) {
    // alert("createMarker("+latlng+","+label+","+html+","+color+")");
    const contentString = '<b>' + label + '</b><br>' + html;
    const marker = new google.maps.Marker({
      position: latlng,
      title: label,
      zIndex: 999999
    });

    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    // add function
    marker.addListener('mouseover', () => {
      infowindow.open(this.gmapContainer, marker);
    });
    marker.addListener('click', () => {
      infowindow.open(this.gmapContainer, marker);
    });
    marker.addListener('mouseout', () => {
      infowindow.close();
    });
    return marker;
  }


  groupBy(list, keyGetter) {
    const shapemap = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = shapemap.get(key);
      if (!collection) {
        shapemap.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return shapemap;
  }

  followtrip(trip: any) {
    //console.log(trip);
    this.selectedtrain = trip;
    for (const t of this.movetrains) {
      t.setVisible(false);
      t.setMap(null);
    }
    this.notfollow = false;
  }


  async checkValue(event) {
    if (event.currentTarget.checked) {
      const route = event.currentTarget.value;
      const trips = await this.gtfsService.getTrips();
      const trip = trips.find(x => x.routeId == route);
      const shapeId = trip.shapeId;

      const shapes: Shape[] = await this.gtfsService.getShapes();
      const shape_details: ShapeDetail[] = await this.gtfsService.getShapeDetail();
      const color = shape_details.find(shape_detail => shape_detail.shape_id === shapeId).color;
      //console.log(color);
      const grouped = this.groupBy(shapes, (shape: any) => shape.shapeId);
      const shapefile = grouped.get(shapeId);

      let coordinates = [];
      for (const shape of shapefile) {
        const position = new google.maps.LatLng(shape.shapePtLat, shape.shapePtLon);
        coordinates.push(position);
      }
      const tripPath = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: `#${color}`,
        strokeOpacity: 1.0,
        strokeWeight: 4
      });

      tripPath.setMap(this.gmapContainer);
      const element = this.map_popupRef.nativeElement;
      jQuery(element).modal('show');

    }
  }
  singletrip(secs: number) {
    for (const t of this.movetrains) {
      t.setVisible(false);
      t.setMap(null);
    }
    //get this.selectedtrain
    //console.log(this.selectedtrain);
    //console.log(this.activeTrains);
    //console.log(secs);
    const train = this.activeTrains.filter(t => t.trip_id == this.selectedtrain.trip_id)[0];
    console.log('984 train-----',train);

    const spherical = google.maps.geometry.spherical;
    const shape = train.shape_id;
    // shapeMap
    const polyline = this.shapeMap.get(shape);
    const polyLengthMeters = spherical.computeLength(polyline.getPath());
    const direction = train.direction_id;
    let diff_time = 0;
    let diff_distance = 0;
    const total_diff_time = train.departure_secs - train.arrival_secs;
    // console.log(`id ${trains[i].trip_id}  direction_id ${direction}`);
    //  +departure_sec +---diff------+sec---------+
    // time --> distance --> latlng
    if (direction == true) {  // outbound
      diff_time = train.departure_secs - secs;
      diff_distance = (polyLengthMeters * diff_time) / total_diff_time;
    }
    if (direction == false) { // inbound
      diff_time = secs - train.arrival_secs;
      diff_distance = (polyLengthMeters * diff_time) / total_diff_time;
    }
    // const startlatlng = polyline.getPath().getAt(0);
    const startlatlng = polyline.GetPointAtDistance(diff_distance);
    const lastPosn = polyline.GetPointAtDistance(diff_distance - 10);
    const markerLabel = train.trip_id;
    let heading: any;
    let tripdirection: any;
    // set direction in/out trip
    if (direction == true) {  // outbound
      heading = google.maps.geometry.spherical.computeHeading(lastPosn, startlatlng);
      // rotate 180 degree
      heading = heading - 180;
      tripdirection = 'ขาออก';
      train.heading = heading;
      train.tripdirection = tripdirection;
    }
    if (direction == false) { // inbound
      heading = google.maps.geometry.spherical.computeHeading(lastPosn, startlatlng);
      tripdirection = 'ขาเข้า';
      train.heading = heading;
      train.tripdirection = tripdirection;
    }

    const trainicon = {
      path: this.icon,
      scale: 0.6,
      strokeColor: '#F8F9F9',
      strokeWeight: 1,
      fillOpacity: 1,
      fillColor: '#E74C3C',
      anchor: new google.maps.Point(25, 25),
      rotation: heading
    };

    const trainicon2 = {
      path: this.icon,
      scale: 0.6,
      strokeColor: '#1b16ad',
      strokeWeight: 1,
      fillOpacity: 1,
      fillColor: '#1664ad',
      anchor: new google.maps.Point(25, 25),
      rotation: heading
    };
    // initial marker

    //this.gmapContainer.setCenter(startlatlng);
    this.gmapContainer.panTo(startlatlng);
    this.gmapContainer.setMapTypeId('satellite');
    this.gmapContainer.setZoom(16);

    const marker = new google.maps.Marker({
      position: null,
      icon: trainicon,
      map: this.gmapContainer,
      zIndex: 9999999
    });


    marker.setPosition(startlatlng);


    let density = "";
    for (let j = 0; j < train.density; j++) {
      density += '<span ><img src="assets/dist/icons/man.png" /></span>';
    }
    const content = `
     <div class="info-window">
        <span class="fa-stack fa-lg">
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-train fa-stack-1x fa-inverse"></i>
        </span>
        <span class="badge badge-danger"> ${markerLabel}</span><span> ทิศทาง ${tripdirection}</span>
        <p> เส้นทาง ${train.stop_idA} - ${train.stop_idB} </p>
        <div class="alert alert-light">
            <p> <b> ความหนาแน่น ${train.density * 10} % </b> </p>
            ${density}
        </div>

      </div>
     `;
    const infowindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 200
    });
    marker.addListener('mouseover', () => {
      infowindow.open(this.gmapContainer, marker);
    });
    marker.addListener('mouseout', () => {
      infowindow.close();
    });

    this.movetrains.push(marker);
  }
}

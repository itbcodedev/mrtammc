import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GtfsrtwsService } from '../../services/gtfsrtws.service';
import { GtfsService } from '../../services/gtfs2.service';
import { RouteformatService } from '../../services/routeformat.service';
import { KmltorouteService } from '../../services/kmltoroute.service';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

declare let L;

@Component({
  selector: 'app-gtfsrt',
  templateUrl: './gtfsrt.component.html',
  styleUrls: ['./gtfsrt.component.scss'],
})
export class GtfsrtComponent implements OnInit {
  @ViewChild('dataContainer', { static: false }) dataContainer: ElementRef;

  map: any;
  routes;
  wsdata;
  stops;
  baseLayers;
  stoptimes;
  stoptimesbasic;
  allStopTimes;
  trips;
  time;
  // todo: change to v2

  // data lable in card
  card;
  isDark;
  cardHeight;
  color;
  direction;
  headsign;
  leaving_in_label;
  leaving_in;
  bodyHeight;
  stopTimes;
  stopGuide;
  stopNames;
  next_in_label;
  next_in;
  ActiveTrain = {};
  StationMarkers = {};
  layerRouteGroup = {};
  SelectedTrain = [];
  routesinfo = [];
  activeRoutes;
  incomingTrain = [];
  totalTrips = [];
  tripbycalendar = [];
  selectrouteid;
  controllerLayer;
  selectTripId;
  CurrentDate;
  StationTrips;
  geojson_route;
  endtrip;
  selectMarker;

  // +
  routformats;
  allstations;

  kmlroutes;
  routelayerGroup;
  singleGroup;
  selectlayer;
  // {station_id: , trips:  {in: ,out: }}
  constructor(
    private _gtfsws: GtfsrtwsService,
    private gtfsService: GtfsService,
    private routeformatservice: RouteformatService,
    private _kmltorouteservice: KmltorouteService
  ) {
    // this.CurrentDate = moment().subtract(3, 'hours');
    this.CurrentDate = moment();
  }

  async ngOnInit() {
    setInterval(() => {
      this.updatetime();
      this.totalTrips = this.routesinfo.filter((obj) => {
        return this.checktime(obj.start_time, obj.end_time);
      });
    }, 1000);

    this.loadbaselayers();

    function style(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 2,
        fillColor: '#ff7800',
        color: '#ff0000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5,
      });
    }

    // get data
    this.routesinfo = await this.gtfsService.getRouteInfo();
    this.routes = await this.gtfsService.getRoutesBasic();
    this.allStopTimes = await this.gtfsService.allStopTimes();
    this.stops = await this.gtfsService.getStops();
    this.trips = await this.gtfsService.getTrips();
    this.kmlroutes = await this._kmltorouteservice.getkmltoroute().toPromise();
    // Create layerRouteGroup
    this.showAllMapLayer();
    // this.removeAllRouteLayer()

    this.totalTrips = this.routesinfo.filter((obj) => {
      return this.checktime(obj.start_time, obj.end_time);
    });

    this.tripbycalendar = this.checkCalenadar(this.totalTrips);
    //
    this.getstations();
    this.getRouteformat();

    this.loadGeojson();
    // this.showAllgeojson();
    this.getKmltoroute();
    // this.removeAllgeojson()
    // this.showgeojson("00011")

    await this.loadStoptimes();
    await this.loadStation();
    await this.loadTrips();

    // console.log(this.trips.length);
    // await this.getTripsAtStop("PP01")

    this.controllerLayer = L.control.layers(this.baseLayers);
    this.controllerLayer.addTo(this.map);

    // this.map.on('click', (e) => {
    //   console.log(e.latlng);
    //   this.selectMarker = null
    // });

    this.map.on(
      {
        click: () => {
          this.selectMarker = null;
          // const latLon = L.latLng(13.788593154063312, 100.44842125132114);
          // this.map.setView(latLon, 12);

          // L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
          //   attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // }).addTo(this.map);
        },
        popupclose: function () {
          this.selectMarker = null;
        },
        baselayerchange: (e) => {
          console.log("161", e);
          this.selectlayer = e 
        }
      },
      this
    );
    // let marker = new L.Marker();

    const icon = new L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/leaflet/marker-shadow.png',
    });

    const trainLocationMarkers = {};

    // get data from web socket
    this._gtfsws.listen('gtfsrt').subscribe(async (data) => {
      // get time
      // this.CurrentDate = moment().subtract(3, 'hours');
      this.CurrentDate = moment();
      this.wsdata = JSON.stringify(data, null, 2);
      // // DEBUG: data from webservice
      // console.log('181..........', this.wsdata);
      const route_name = data['header']['route_name'];
      const route_id = data['header']['route_id'];
      const direction = data['header']['direction'];
      const headsign = data['header']['headsign'];
      const runtime = data['header']['runtime'];
      const time_now_sec = data['entity']['vehicle']['trip']['time_now_sec'];
      const start_time_secs =
        data['entity']['vehicle']['trip']['start_time_secs'];
      const end_time_secs = data['entity']['vehicle']['trip']['end_time_secs'];
      const start_time = data['entity']['vehicle']['trip']['start_time'];
      const end_time = data['entity']['vehicle']['trip']['end_time'];
      const trip_id = data['entity']['vehicle']['trip']['trip_id'];
      const loc_order = data['entity']['vehicle']['trip']['loc_order'];
      // // TODO: display info on marker
      // tripEntity = `${stoptime.route_name}-${stoptime.trip_id}`
      const tripEntity = data['entity']['id'];
      const vehicle = data['entity']['vehicle'];
      const latitude = data['entity']['vehicle']['position']['latitude'];
      const longitude = data['entity']['vehicle']['position']['longitude'];
      // create lat lng instance
      const trainLatLng = new L.LatLng(latitude, longitude);

      const t0 = performance.now();
      // getdata from api
      const routeinfowithtrips = await this.gtfsService.getrouteinfowithtrip(
        trip_id
      );
      const t1 = performance.now();
      // console.log( ' debug Time for routeinfowithtrips ' + (t1 - t0) + ' millisec');
      // filter again filter only active trip
      const t2 = performance.now();
      // filter  ontrack  
      const routetrips = routeinfowithtrips.filter((obj) => {
        return this.checktime(obj.start_time, obj.end_time);
      });
      const t3 = performance.now();
      // console.log( 'debug Time for routetrips ' + (t3 - t2) + ' millisec');
      // debug
      // console.log('218..gtfs.component ', trip_id, loc_order, latitude, longitude );
      // 2 find next station
      const nextstation = routetrips.map((obj) => {
        // purple 00118 224
        // console.log(obj.route_name, obj.trip_id, obj.stoptimes.length)
        // filter stoptime
        const selectStoptimes = obj.stoptimes.filter((st_obj) => {
          // filter next time check depature_time less than timenow [0]
          //   {
          //     "_id": "5d2a8f3f1473da58b879e4f8",
          //     "agency_key": "MRTA_Transit",
          //     "trip_id": "041921",
          //     "arrival_time": "16:44:31",
          //     "departure_time": "16:44:31",
          //     "stop_id": "BL13",
          //     "stop_sequence": 4,
          //     "__v": 0
          // },
          
          return this.findNextTrip60min(st_obj.arrival_time);
        });
        // console.log(241, selectStoptimes.length)
        obj.selectStoptimes = _.first(selectStoptimes);
        return obj;
      });

      console.log(246, nextstation)
      // tslint:disable-next-line: triple-equals
      if (nextstation[0] != undefined) {
        const nextstop = nextstation[0].selectStoptimes;
        const timenow = this.CurrentDate.format('HH:mm:ss');
        // find difftime to station
        const arr_time = this.getsecond(nextstop.arrival_time);
        const arr_now = this.getsecond(timenow);
        // console.log('arr_time,arr_now', arr_time, arr_now);
        // 1 sec = 0.0166666667 min
        nextstop.difftime = (arr_time - arr_now).toFixed(2);
        // cal random number
        const number = this.getRandom();

        if (this.ActiveTrain.hasOwnProperty(tripEntity)) {
          // exist
          if (trainLocationMarkers[tripEntity] !== undefined) {
            // update marker
            const marker_trip = trainLocationMarkers[tripEntity];
            // trainLatLng
            marker_trip.setLatLng(trainLatLng);
            // marker_trip.fire('click');
            // markerinfo
            marker_trip.nextstop = nextstop.stop_id;
            marker_trip.arrival_time = nextstop.arrival_time;
            marker_trip.departure_time = nextstop.departure_time;
            marker_trip.difftime = nextstop.difftime;
            // console.log(marker_trip.stop_id,marker_trip.trip_id,marker_trip.arrival_time,marker_trip.direction)
            this.setStationInfo(
              marker_trip.stop_id,
              marker_trip.trip_id,
              marker_trip.arrival_time,
              marker_trip.direction
            );
            // update station
            marker_trip.on('mouseover', this.onTrainClick, this);
            marker_trip.on('mouseout', this.onTrainClick, this);
          }
        } else {
          // new marker
          this.ActiveTrain[tripEntity] = vehicle;
          //// TODO: 1 create marker
          const marker = this.createMarker(trainLatLng, route_name);
          console.log('276 create marker result', route_name, marker);
          // add marker
          // marker.addTo(this.map).bindPopup(`${tripEntity}`)
          this.layerRouteGroup[route_id].addLayer(marker);
          console.log('281', this.layerRouteGroup);
          // marker function
          marker.tripEntity = tripEntity;
          marker.trip_id = trip_id;
          marker.start_time = start_time;
          marker.end_time = end_time;
          marker.direction = direction;
          console.log('287...', route_name);
          marker.color = this.getColor(route_name);
          marker.track = this.getTrack(route_name);
          marker.headsign = headsign;
          marker.runtime = runtime;

          marker.map = this.map;
          marker.controllerLayer = this.controllerLayer;
          // markerinfo
          marker.nextstop = nextstop.stop_id;
          marker.arrival_time = nextstop.arrival_time;
          marker.departure_time = nextstop.departure_time;
          marker.difftime = nextstop.difftime;

          marker.bindPopup('Trip info');

          marker.on('mouseover', this.onTrainClick, this);
          marker.on('mouseout', this.onTrainClick, this);
          marker.on(
            'click',
            (event) => {
              this.map.setView(marker.getLatLng(), 16);
              // L.tileLayer(
              //   'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
              //   {
              //     maxZoom: 20,
              //     subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
              //   }
              // ).addTo(this.map);

              L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(this.map);

              this.selectTripId = marker.tripEntity;
              this.onTrainClick(this);
            },
            this
          );

          trainLocationMarkers[tripEntity] = marker;
          console.log(
            marker.stop_id,
            marker.trip_id,
            marker.arrival_time,
            marker.direction
          );
          this.setStationInfo(
            marker.stop_id,
            marker.trip_id,
            marker.arrival_time,
            marker.direction
          );
        }
      }

      if (this.selectMarker != undefined) {
        this.updateTrain();
      }
      // Clear marker from array
      // check train over due
      for (const key in this.ActiveTrain) {
        if (time_now_sec > this.ActiveTrain[key]['trip']['end_time_secs']) {
          console.log(
            'remove key',
            key,
            this.ActiveTrain[key]['trip']['trip_id']
          );
          this.endtrip = this.ActiveTrain[key]['trip']['trip_id'];
          delete this.ActiveTrain[key];
          // this.endtrip = this.ActiveTrain[key]['trip']
        } else {
          // console.log("not over due")
        }
      }
      // delete marker of overdue
      for (const key in trainLocationMarkers) {
        if (this.ActiveTrain.hasOwnProperty(key)) {
          // console.log(`${key} still on tracks`);
        } else {
          const marker = trainLocationMarkers[key];
          this.map.removeLayer(marker);
          // console.log(`${key} remove marker`)
          delete trainLocationMarkers[key];
        }
      }
      if (this.ActiveTrain.hasOwnProperty(this.selectTripId)) {
        console.log('select Tripid', this.selectTripId);
        const Center = trainLocationMarkers[this.selectTripId];
        this.map.setView(Center.getLatLng(), 16);
      }
      // update active trip
      this.refreshloadRoute();
    }); // end web service

    // updated latlng follow trip()
  } // init

  onTrainClick(e) {
    // get marker
    this.selectMarker = e.target;
    const marker = e.target;
    marker.passengerNum = this.getRandom();
    this.selectMarker = marker;
    console.log(397, e.target.nextstop)

    const html = `
    <div class="card" style="width: 18rem;">
      <div class="card-header" style="background-color:${
        e.target.color
      }; padding: 0.5rem 0.15rem !important;">
      <div class="row">
        <div class="col-md-3 text-center">
        <svg width="50px" height="50px" viewBox="-10 -10 80 80">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <circle fill="#FFFFFF" cx="32" cy="32" r="32"></circle>
            <path
              d="M20.7894737,31.0526316 L43.5263158,31.0526316 L43.5263158,21.5789474 L20.7894737,21.5789474 L20.7894737,31.0526316 Z M40.6842105,42.4210526 C39.1115789,42.4210526 37.8421053,41.1515789 37.8421053,39.5789474 C37.8421053,38.0063158 39.1115789,36.7368421 40.6842105,36.7368421 C42.2568421,36.7368421 43.5263158,38.0063158 43.5263158,39.5789474 C43.5263158,41.1515789 42.2568421,42.4210526 40.6842105,42.4210526 L40.6842105,42.4210526 Z M23.6315789,42.4210526 C22.0589474,42.4210526 20.7894737,41.1515789 20.7894737,39.5789474 C20.7894737,38.0063158 22.0589474,36.7368421 23.6315789,36.7368421 C25.2042105,36.7368421 26.4736842,38.0063158 26.4736842,39.5789474 C26.4736842,41.1515789 25.2042105,42.4210526 23.6315789,42.4210526 L23.6315789,42.4210526 Z M17,40.5263158 C17,42.2025263 17.7389474,43.6905263 18.8947368,44.7326316 L18.8947368,48.1052632 C18.8947368,49.1473684 19.7473684,50 20.7894737,50 L22.6842105,50 C23.7364211,50 24.5789474,49.1473684 24.5789474,48.1052632 L24.5789474,46.2105263 L39.7368421,46.2105263 L39.7368421,48.1052632 C39.7368421,49.1473684 40.5793684,50 41.6315789,50 L43.5263158,50 C44.5684211,50 45.4210526,49.1473684 45.4210526,48.1052632 L45.4210526,44.7326316 C46.5768421,43.6905263 47.3157895,42.2025263 47.3157895,40.5263158 L47.3157895,21.5789474 C47.3157895,14.9473684 40.5326316,14 32.1578947,14 C23.7831579,14 17,14.9473684 17,21.5789474 L17,40.5263158 Z"
              fill="${e.target.color}"></path>
          </g>
        </svg>

        <button id="button-submit" class="badge badge-danger " type="button">Follow</button>

        </div>
        <div class="col-md-3">
          <p style="color: #ffffff; margin: 2px 0;">เส้นทาง</p>
          <p style="color: #ffffff; margin: 2px 0;">เวลาที่ใช้</p>
          <p style="color: #ffffff; margin: 2px 0;">ขบวนรถ</p>
          <p style="color: #ffffff; margin: 2px 0;">ผู้โดยสาร</p>
        </div>
        <div class="col-md-4">
          <p style="color: #ffffff; margin: 2px 0;">${e.target.headsign}</p>
          <p style="color: #ffffff; margin: 2px 0;">${e.target.runtime} m.</p>
          <p style="color: #ffffff; margin: 2px 0;">${e.target.trip_id}</p>
          <p style="color: #ffffff; margin: 2px 0;">
              <img src="/assets/dist/icons/man.png"> N/A คน
          </p>
       </div>
      <div class="col-md-2">
      <button id="unfollow" class="badge badge-primary " type="button">
      <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
      </div>

      </div>
    </div>
      <ul class="list-group list-group-flush">
      <li class="list-group-item m-0">

     <p class="m-0">
     <img src="${e.target.track}"  height="32" width="15">
     สถานีถัดไป: <b>${e.target.nextstop}</b> ใช้เวลา
     ${Math.floor(e.target.difftime / 60)} นาที  ${
      e.target.difftime % 60
    } วินาที

     </p>
   </li>
   <li class="list-group-item">
       <p class="m-1">
          <b> arrival: ${e.target.arrival_time} departure: ${
      e.target.departure_time
    } </b>
       </p>
   </li>
      </ul>
</div>
    `;
    const popup = e.target.getPopup();
    popup.setContent(html);
    popup.update();
    marker.openPopup();

    const buttonSubmit = L.DomUtil.get('button-submit');
    L.DomEvent.addListener(
      buttonSubmit,
      'click',
      function (e) {
        this.map.setView(marker.getLatLng(), 16);
        // L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        //   maxZoom: 20,
        //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        // }).addTo(this.map);

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
             attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         }).addTo(this.map);

        this.selectTripId = marker.tripEntity;
      },
      this
    );

    // click un follow
    const unfollow = L.DomUtil.get('unfollow');
    L.DomEvent.addListener(
      unfollow,
      'click',
      function (e) {
        location.reload();
        // const latLon = L.latLng(13.788593154063312, 100.44842125132114);
        // this.map.setView(latLon, 12);

        // L.tileLayer(
        //   "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        //   {
        //     maxZoom: 12,
        //     subdomains: ["mt0", "mt1", "mt2", "mt3"]
        //   }
        // ).addTo(this.map);

        // this.selectTripId = marker.tripEntity;
        // console.log("unfollow");
        // // marker.closePopup();
      },
      this
    ); // point to this context
  } // end function onMarkerClick display popup with button

  updateTrain() {
    const marker = this.selectMarker;
    const html = `
    <div class="card" style="width: 18rem;">
      <div class="card-header" style="background-color:${
        marker.color
      }; padding: 0.5rem 0.15rem !important;">
      <div class="row">
        <div class="col-md-3 text-center">
        <svg width="50px" height="50px" viewBox="-10 -10 80 80">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <circle fill="#FFFFFF" cx="32" cy="32" r="32"></circle>
            <path
              d="M20.7894737,31.0526316 L43.5263158,31.0526316 L43.5263158,21.5789474 L20.7894737,21.5789474 L20.7894737,31.0526316 Z M40.6842105,42.4210526 C39.1115789,42.4210526 37.8421053,41.1515789 37.8421053,39.5789474 C37.8421053,38.0063158 39.1115789,36.7368421 40.6842105,36.7368421 C42.2568421,36.7368421 43.5263158,38.0063158 43.5263158,39.5789474 C43.5263158,41.1515789 42.2568421,42.4210526 40.6842105,42.4210526 L40.6842105,42.4210526 Z M23.6315789,42.4210526 C22.0589474,42.4210526 20.7894737,41.1515789 20.7894737,39.5789474 C20.7894737,38.0063158 22.0589474,36.7368421 23.6315789,36.7368421 C25.2042105,36.7368421 26.4736842,38.0063158 26.4736842,39.5789474 C26.4736842,41.1515789 25.2042105,42.4210526 23.6315789,42.4210526 L23.6315789,42.4210526 Z M17,40.5263158 C17,42.2025263 17.7389474,43.6905263 18.8947368,44.7326316 L18.8947368,48.1052632 C18.8947368,49.1473684 19.7473684,50 20.7894737,50 L22.6842105,50 C23.7364211,50 24.5789474,49.1473684 24.5789474,48.1052632 L24.5789474,46.2105263 L39.7368421,46.2105263 L39.7368421,48.1052632 C39.7368421,49.1473684 40.5793684,50 41.6315789,50 L43.5263158,50 C44.5684211,50 45.4210526,49.1473684 45.4210526,48.1052632 L45.4210526,44.7326316 C46.5768421,43.6905263 47.3157895,42.2025263 47.3157895,40.5263158 L47.3157895,21.5789474 C47.3157895,14.9473684 40.5326316,14 32.1578947,14 C23.7831579,14 17,14.9473684 17,21.5789474 L17,40.5263158 Z"
              fill="${marker.color}"></path>
          </g>
        </svg>

        <button id="button-submit" class="badge badge-danger " type="button">Follow</button>

        </div>
        <div class="col-md-3">
          <p style="color: #ffffff; margin: 2px 0;">เส้นทาง</p>
          <p style="color: #ffffff; margin: 2px 0;">เวลาที่ใช้</p>
          <p style="color: #ffffff; margin: 2px 0;">ขบวนรถ</p>
          <p style="color: #ffffff; margin: 2px 0;">ผู้โดยสาร</p>
        </div>
        <div class="col-md-4">
          <p style="color: #ffffff; margin: 2px 0;">${marker.headsign}</p>
          <p style="color: #ffffff; margin: 2px 0;">${marker.runtime} m.</p>
          <p style="color: #ffffff; margin: 2px 0;">${marker.trip_id}</p>
          <p style="color: #ffffff; margin: 2px 0;">
              <img src="/assets/dist/icons/man.png"> N/A คน
          </p>
        </div>
        <div class="col-md-2">
        <button id="unfollow" class="badge badge-primary " type="button">
        <i class="fa fa-refresh" aria-hidden="true"></i>
        </button>
        </div>
      </div>
    </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item m-0">

          <p class="m-0">
          <img src="${marker.track}"  height="32" width="15">
          สถานีถัดไป: <b>${marker.nextstop}</b> ใช้เวลา
          ${Math.floor(marker.difftime / 60)} นาที  ${
      marker.difftime % 60
    } วินาที
          </p>
        </li>
        <li class="list-group-item">
            <p class="m-1">
              <b> arrival: ${marker.arrival_time} departure: ${
      marker.departure_time
    } </b>
            </p>
        </li>
      </ul>
</div>
    `;
    const popup = marker.getPopup();
    popup.setContent(html);
    popup.update();
    marker.openPopup();

    // click follow
    const buttonSubmit = L.DomUtil.get('button-submit');
    L.DomEvent.addListener(
      buttonSubmit,
      'click',
      function (e) {
        this.map.setView(marker.getLatLng(), 16);
        L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }).addTo(this.map);

        this.selectTripId = marker.tripEntity;
        console.log(this.selectTripId);
        // marker.closePopup();
      },
      this
    ); // point to this context

    // click un follow
    const unfollow = L.DomUtil.get('unfollow');
    L.DomEvent.addListener(
      unfollow,
      'click',
      function (e) {
        location.reload();

        // const latLon = L.latLng(13.788593154063312, 100.44842125132114);
        // this.map.setView(latLon, 12);
        // L.tileLayer(
        //   "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        //   {
        //     maxZoom: 12,
        //     subdomains: ["mt0", "mt1", "mt2", "mt3"]
        //   }
        // ).addTo(this.map);

        // this.selectTripId = marker.tripEntity;
        // console.log("unfollow");
        // // marker.closePopup();
      },
      this
    ); // point to this context
  }

  updatetime() {
    const currentDate = new Date();
    this.time = currentDate.toLocaleTimeString('th-TH', {
      timeZone: 'Asia/Bangkok',
    });
  }

  showAllMapLayer(): any {
    this.routes.forEach((obj) => {
      const obj_route_id = obj.route_id;
      // const layerGroup[obj_route_id] = new L.layerGroup()
      this.layerRouteGroup[obj_route_id] = L.layerGroup();
      this.layerRouteGroup[obj_route_id].addTo(this.map);
    });

    // untrip layer
    this.layerRouteGroup['notrip'] = L.layerGroup();
    this.layerRouteGroup['notrip'].addTo(this.map);
  }

  removeAllRouteLayer() {
    // this.map.eachLayer((layer) => {
    //   this.map.removeLayer(layer)
    // });
    this.routes.forEach((obj) => {
      const obj_route_id = obj.route_id;
      const layer = this.layerRouteGroup[obj_route_id];
      this.map.removeLayer(layer);
    });

    // remove untrip layer
    this.map.removeLayer(this.layerRouteGroup['notrip']);
  }

  // blue_line.addTo(this.map);
  // purple_line.addTo(this.map);
  // blue_chalearm_line.addTo(this.map);
  // blue_extend_line.addTo(this.map);
  // orange_line.addTo(this.map);
  // dark_green_line.addTo(this.map);
  // light_green_line.addTo(this.map);
  // light_green_extend_line.addTo(this.map);

  showRouteLayer(kml) {
    console.log(660, kml)
    this.removeAllgeojson();
    // this.removeAllRouteLayer();
    this.routelayerGroup.clearLayers();
    
    const line = new L.GeoJSON.AJAX(kml.geojsonline_file, {
        style: function (feature) {
          return { color: kml.color };
        },
      });

    console.log(669, line);
    
    line.on('data:progress', () => {
      this.map.fitBounds(this.routelayerGroup.getBounds())
      })
      .addTo(this.routelayerGroup)
    // this.routelayerGroup.addLayer(line);

    this.routelayerGroup.addTo(this.map);

    
    //this.layerRouteGroup[route_id].addTo(this.map);
    // show route geojson
    // this.showgeojson(route_id);
  }

  loadbaselayers() {
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib =
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl =
      'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib =
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = new L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = new L.tileLayer(landUrl, { attribution: thunAttrib });

    const googleStreets = new L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    const googleHybrid = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    const googleSat = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    const googleTerrain = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    const latLon = L.latLng(13.788593154063312, 100.44842125132114);
    this.map = L.map('map').setView(latLon, 12);

    // default
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.attributionControl.setPrefix('');

    this.baseLayers = {
      'OSM Map': osmMap,
      'Light Map': lightMap,
      googleStreets: googleStreets,
      googleHybrid: googleHybrid,
      googleSat: googleSat,
      googleTerrain: googleTerrain,
    };
  }

  // load geojson
  loadGeojson() {

    const purple_line = new L.GeoJSON.AJAX('/assets/dist/kml/purplenorthline.geojson', {
      style: function (feature) {
        return {
          color: 'purple',
        };
      },
    });

    
    const blue_line = new L.GeoJSON.AJAX('/assets/dist/kml/blue.geojson', {
      style: function (feature) {
        return {
          color: '#214374',
        };
      },
    });

    const blueline = new L.GeoJSON.AJAX('/assets/dist/kml/blueline.geojson', {
      style: function (feature) {
        return {
          color: '#2a5491',
        };
      },
    });

    const blueline_extend = new L.GeoJSON.AJAX(
      '/assets/dist/kml/blueline_extend.geojson',
      {
        style: function (feature) {
          return {
            color: '#2a5491',
          };
        },
      }
    );

    const orange_line = new L.GeoJSON.AJAX('/assets/dist/kml/orange.geojson', {
      style: function (feature) {
        return {
          color: '#FF6600',
        };
      },
    });


    const dark_green_line = new L.GeoJSON.AJAX(
      '/assets/dist/kml/dark_green.geojson',
      {
        style: function (feature) {
          return {
            color: '#458B00',
          };
        },
      }
    );

  
    const light_green_line = new L.GeoJSON.AJAX(
      '/assets/dist/kml/light_green.geojson',
      {
        style: function (feature) {
          return {
            color: '#66CD00',
          };
        },
      }
    );


    const light_green_extend_line = new L.GeoJSON.AJAX(
      '/assets/dist/kml/light_green_extend.geojson',
      {
        style: function (feature) {
          return {
            color: '#66CD00',
          };
        },
      }
    );


    const pink_line = new L.GeoJSON.AJAX('/assets/dist/kml/pink_line.geojson', {
      style: function (feature) {
        return {
          color: '#FF1493',
        };
      },
    });


    const purple_line_south = new L.GeoJSON.AJAX(
      '/assets/dist/kml/purple_line_south2.geojson',
      {
        style: function (feature) {
          return {
            color: '#FF00FF',
          };
        },
      }
    );


    const yellow_line = new L.GeoJSON.AJAX(
      '/assets/dist/kml/yellow_line.geojson',
      {
        style: function (feature) {
          return {
            color: '#FFFF00',
          };
        },
      }
    );

    // blue_line.addTo(this.map);
    // purple_line.addTo(this.map);
    // blue_chalearm_line.addTo(this.map);
    // blue_extend_line.addTo(this.map);
    // orange_line.addTo(this.map);
    // dark_green_line.addTo(this.map);
    // light_green_line.addTo(this.map);
    // light_green_extend_line.addTo(this.map);

    this.geojson_route = {
      purple_line: {
        geojson: purple_line,
        routes: ['00011', '00012'],
      },
      blueline: {
        geojson: blueline,
        routes: ['00002', '00001'],
      },
      blueline_extend: {
        geojson: blueline_extend,
        routes: ['00002', '00001'],
      },
      orange_line: {
        geojson: orange_line,
        routes: [],
      },
      dark_green_line: {
        geojson: dark_green_line,
        routes: [],
      },
      light_green_line: {
        geojson: light_green_line,
        routes: [],
      },
      light_green_extend_line: {
        geojson: light_green_extend_line,
        routes: [],
      },
      pink_line: {
        geojson: pink_line,
        routes: [],
      },
      purple_line_south: {
        geojson: purple_line_south,
        routes: [],
      },
      yellow_line: {
        geojson: yellow_line,
        routes: [],
      },
    };
  }

  resumeGeojson() {
    this.showAllgeojson();
  }


  showAllgeojson() {
    const allgeojson = this.geojson_route;
    const keys = Object.keys(allgeojson);
    // console.log(keys)
    keys.forEach((obj) => {
      allgeojson[obj].geojson.addTo(this.map);
    });
  }

  removeAllgeojson() {
    const allgeojson = this.geojson_route;
    const keys = Object.keys(allgeojson);
    
    keys.forEach((obj) => {
      this.map.removeLayer(allgeojson[obj].geojson);
    });
  }

  showgeojson(route_id) {
    this.removeAllgeojson();
    const allgeojson = this.geojson_route;
    const keys = Object.keys(allgeojson);
    keys.forEach((obj) => {
      // console.log(obj,allgeojson[obj].routes.includes(route_id))
      if (allgeojson[obj].routes.includes(route_id)) {
        allgeojson[obj].geojson.addTo(this.map);
      }
    });
  }
  async loadTrips() {
    this.trips = await this.gtfsService.getTrips();
  }

  getdirection(trip_id) {
    console.log('965..', trip_id);
    const trip = this.trips.find((t) => {
      return t.trip_id == trip_id;
    });
    console.log('968 ..', trip);
    return trip.direction_id;
  }

  getRandom() {
    let number;
    const d = new Date();
    const hour = d.getHours();
    // Math.floor(Math.random() * (max - min + 1)) + min;

    switch (true) {
      case hour < 7:
        number = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
        break;
      case hour < 9:
        number = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
        break;
      case hour < 12:
        number = Math.floor(Math.random() * (800 - 500 + 1)) + 400;
        break;
      case hour < 16:
        number = Math.floor(Math.random() * (600 - 200 + 1)) + 200;
        break;
      case hour < 20:
        number = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
        break;
      case hour < 21:
        number = Math.floor(Math.random() * (500 - 100 + 1)) + 300;
        break;
      default:
        number = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
    }

    return number;
  }

  // +

  getstations() {
    this.gtfsService.getallstations().then((obj) => {
      this.allstations = obj;
      console.log('790', this.allstations);
      this.routes = Object.keys(obj);
      console.log('792', this.routes); // Array [ "BL", "PP" ]
    });
  }

  getRouteformat() {
    this.routeformatservice.getrouteformat().subscribe(
      (result) => {
        // console.log("115", result)
        this.routformats = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getstationicon(stopid) {
    let route;
    this.routes.forEach((key, index) => {
      const arrays = [];
      this.allstations[key].forEach((record) => {
        // console.log("105",record.station)
        arrays.push(record.station);
      });
      // console.log("107", key, arrays)
      const result = arrays.includes(stopid) ? key : null;
      if (result !== null) {
        route = result;
        // console.log("122", index, stopid, route)
      }
    });
    return route;
  }

  async loadStation() {
    this.stops.forEach(async (stop, index) => {
      // get station icon path
      const route = this.getstationicon(stop.stop_id.trim());

      let stopicon = '';
      let station_icon;
      if (route === undefined || route === null) {
        // default
        stopicon = environment.iconbase + stop.icon;
      } else {
        this.routformats.forEach((obj) => {
          if (obj.route == route) {
            station_icon = '.' + obj.station_icon;
          }
        });

        if (station_icon === undefined || station_icon === null) {
          stopicon = environment.iconbase + stop.icon;
        } else {
          stopicon = station_icon;
        }
      }

      // console.log('1072... ', stop.stop_id, stopicon);

      const icon = new L.icon({
        iconSize: [22, 22],
        // iconAnchor: [0, 0],
        iconUrl: stopicon,
      });
      // location
      const stationLatLng = new L.LatLng(stop.stop_lat, stop.stop_lon);
      const marker = new L.Marker();
      marker.setIcon(icon);
      marker.setLatLng(stationLatLng);
      marker.bindPopup(
        "<img width='45' src='" + '/assets/dist/img/loading.gif' + "'/>"
      );
      marker.stop_id = stop.stop_id;
      marker.stop_url = stop.stop_url;
      marker.stop_name = stop.stop_name;
      this.StationMarkers[stop.stop_id] = marker;
      const unique_route_ids = await this.getRoutebyStop(stop.stop_id);
      console.log(unique_route_ids);
      if (unique_route_ids.length > 0) {
        unique_route_ids.forEach((route_id) => {
          this.layerRouteGroup[`${route_id}`].addLayer(marker);
        });
      } else {
        this.layerRouteGroup['notrip'].addLayer(marker);
      }

      async function onMarkerClick(e) {
        this.selectMarker = null;
        const stoptimes_next = await this.loadallstoptimes(e.target.stop_id);
        // console.log(stoptimes_next)
        console.log('1105', stop.stop_url);
        let li = '';
        stoptimes_next.forEach((st) => {
          console.log('1108 ...', st.trip_id);
          const direction = this.getdirection(st.trip_id);

          // console.log(direction)
          let name;
          if (direction === 1) {
            name = 'ขาออก';
            li +=
              "<li class='list-group-item'>" +
              "<i class='fa fa-arrow-circle-left' style='color:blue'></i>" +
              '  ' +
              name +
              ' trip: ' +
              st.trip_id +
              ' ' +
              'arrival_time: ' +
              st.arrival_time +
              '</li>';
          }

          if (direction === 0) {
            name = 'ขาเข้า';
            li +=
              "<li class='list-group-item'>" +
              "<i class='fa fa-arrow-circle-right' style='color:red'></i>" +
              name +
              ' trip: ' +
              st.trip_id +
              ' ' +
              'arrival_time: ' +
              st.arrival_time +
              '</li>';
          }
        });

        const number = this.getRandom();
        const html = `
          <div class="card trip" style="width: 18rem;">
            <img class="card-img-top"  style="width: 100%; height: 13vw; object-fit: cover;"
            src="${stop.stop_url}" alt="Card image cap">
            <div class="card-body"  style="padding: 0px 8px;">
              <div class="row border" style="background-color: #f5f5f5;">
                <div class="col-md-8">
                  <p style="margin: 2px" >${stop.stop_id}-${stop.stop_name}</p>
                  <p style="margin: 2px" >lat ${stop.stop_lat} long ${stop.stop_lon}</p>
                </div>
              <div class="col-md-4">
                <p style="margin: 2px" >ความหนาแน่น</p>
                <p style="margin: 2px" >
                  <img src="/assets/dist/icons/man.png"> N/A คน
                </p>
              </div>
              </div>
            </div>
            <ul class="list-group list-group-flush">
              ${li}
            </ul>
          </div>

        `;
        const popup = e.target.getPopup();
        popup.setContent(html);
        popup.update();
      } // end function onMarkerClick
      // cb to onMarkerClick
      marker.on('click', onMarkerClick, this);
    });
  }

  async loadallstoptimes(stop_id) {
    // return next coming stoptimes filter by time now
    this.allStopTimes = await this.gtfsService.allStopTimes();
    return this.allStopTimes.filter((stoptime) => {
      // console.log("stoptime.arrival_time",stoptime.arrival_time)
      return (
        this.findNextTrip60min(stoptime.arrival_time) &&
        stoptime.stop_id == stop_id
      );
    });
  }

  async getRoutebyStop(stop_id) {
    // fetch data

    const stoptimes = this.allStopTimes.filter((stoptime) => {
      return stoptime.stop_id == stop_id;
    });

    // console.log(stoptimes)

    const unique_trip_ids = Array.from(
      new Set(stoptimes.map((item) => item.trip_id))
    );

    // console.log(unique_trip_ids)
    // console.log(this.trips)

    const unique_trips = this.trips.filter((trip) => {
      return unique_trip_ids.includes(trip.trip_id);
    });

    // console.log(unique_trips)

    const unique_route_ids = Array.from(
      new Set(unique_trips.map((item) => item.route_id))
    );

    // console.log(unique_route_ids)
    // this.trips = await this.gtfsService.getTrips();
    //
    // const trips = this.trips.filter(trip => {
    //   return trip.trip_id == trip_id
    // })
    //
    // console.log(trip_id,trips)
    // //console.log(stop_id,_.first(trips)["route_id"])
    return unique_route_ids;
  }

  async loadStoptimes() {
    // fix default data
    const agency_key = 'MRTA_Transit';
    const route_id = '00011';
    this.stoptimes = await this.gtfsService.getStopTimes(agency_key, route_id);
    // console.log(this.stoptimes)
  }

  async getTripsAtStop(trip_id) {
    const agency_key = 'MRTA_Transit';
    this.stoptimesbasic = await this.gtfsService.getStopTimesBasic(
      agency_key,
      trip_id
    );

    const selectedStoptimes = await this.stoptimesbasic.filter((stoptime) => {
      return stoptime.trip_id === trip_id;
    });

    if (selectedStoptimes.length > 0) {
      const intime = selectedStoptimes.filter((stoptime) => {
        // return this.checktime(stoptime.arrival_time, stoptime.departure_time)
        return this.findNextTrip60min(stoptime.arrival_time);
      });
      // lastest
      console.log(1251, intime.length)
      const incomingtrip = _.last(intime);
      return incomingtrip;
    }
  }

  findNextTrip(arrival_time: any): any {
    const timenow = this.CurrentDate.format('HH:mm:ss');
    const arrival_time_secs = this.getsecond(arrival_time);
    const timenow_secs = this.getsecond(timenow);

    if (arrival_time_secs > timenow_secs) {
      // console.log('true')
      return true;
    } else {
      // console.log('false')
      return false;
    }
  }

  findNextTrip30min(arrival_time: any): any{ 
    const timenow = this.CurrentDate.format('HH:mm:ss');
    const arrival_time_secs = this.getsecond(arrival_time);
    const timenow_secs = this.getsecond(timenow);
    if (
      arrival_time_secs > timenow_secs &&
      arrival_time_secs < timenow_secs + 1800
    ) {
      // console.log('true')
      return true;
    } else {
      // console.log('false')
      return false;
    }
  }

  findNextTrip60min(arrival_time: any): any {
    const timenow = this.CurrentDate.format('HH:mm:ss');
    const arrival_time_secs = this.getsecond(arrival_time);
    const timenow_secs = this.getsecond(timenow);
    if (
      arrival_time_secs > timenow_secs &&
      arrival_time_secs < timenow_secs + 3600
    ) {
      // console.log('true')
      return true;
    } else {
      // console.log('false')
      return false;
    }
  }

  getColor(color) {
    switch (color) {
      case 'orange':
        return '#FF6600';
      case 'green':
        return '#00EE00';
      case 'blue':
        return '#0000BB';
      case 'purple':
        return '#9933CC';
      default:
        return '#0000BB';
    }
  }

  getTrack(color) {
    switch (color) {
      case 'orange':
        return 'orange';
      case 'green':
        return 'green';
      case 'blue':
        return './assets/dist/img/blue-track.png';
      case 'purple':
        return './assets/dist/img/purple-track.png';
      case 'blue':
        return 'blue';
      default:
        return 'white';
    }
  }

  getsecond(time) {
    const seconds = moment(time, 'HH:mm:ss: A').diff(
      moment().startOf('day'),
      'seconds'
    );
    return seconds;
  }

  createMarker(latlng, color) {
    console.log('1267 create marker args', latlng, color);
    return new L.CircleMarker(latlng, {
      radius: 10,
      fillOpacity: 1,
      color: 'black',
      fillColor: this.getColor(color),
      weight: 2,
      forceZIndex: 999,
    });
  }

  // Check valid train between start_time, endtime_time
  checktime(start_time, endtime_time) {
    const format = 'hh:mm:ss';
    const timenow = this.CurrentDate.format('HH:mm:ss');
    // console.log('timenow', timenow)
    const time = moment(timenow, format);
    const at = moment(start_time, format);
    const dt = moment(endtime_time, format);

    if (time.isBetween(at, dt)) {
      return true;
    } else {
      return false;
    }
  }

  checkCalenadar(trips) {
    const weekday = moment().format('dddd');
    let calendar = [];
    if (weekday === 'Sunday') {
      calendar = ['SU', 'WE'];
    } else if (weekday === 'Saturday') {
      calendar = ['SA', 'WE'];
    } else {
      calendar = ['WD'];
    }
    return trips.filter((trip) => calendar.includes(trip.calendar));
  }

  loadRoute(data: NgForm) {
   
    console.log(1350, data.value); // {route_en:  }

    const kml = this.kmlroutes.filter( (obj) => {
      return (obj.route_en == data.value.route_en)
    })

  
    this.selectrouteid = kml[0].route_id;

    this.activeRoutes = this.routesinfo.filter((obj) => {
      return (
        this.checktime(obj.start_time, obj.end_time) &&
        obj.route_id == this.selectrouteid
      );
    });

    console.log(1366, kml[0])
    
    this.showRouteLayer(kml[0]);
  }

  refreshloadRoute() {
    if (this.selectrouteid != undefined) {
      this.activeRoutes = this.routesinfo.filter((obj) => {
        return (
          this.checktime(obj.start_time, obj.end_time) &&
          obj.route_id == this.selectrouteid
        );
      });
    }
  }

  followtrip(e) {
    console.log(e);
  }

  unfollowtrip(e) {
    console.log(e);
  }

  singleTrip(trip) {}

  setStationInfo(stop_id, trip_id, arrival_time, direction) {
    // console.log("setStationInfo")
    // console.log(stop_id, trip_id, arrival_time, direction)
    const obj = [];
    if (stop_id !== undefined) {
      if (+direction) {
        obj[1] = {
          trip_id: trip_id,
          arrival_time: arrival_time,
          direction: direction,
        };
        this.StationTrips[stop_id] = obj;
      } else {
        obj[0] = {
          trip_id: trip_id,
          arrival_time: arrival_time,
          direction: direction,
        };
        this.StationTrips[stop_id] = obj;
      }
    }
  }

  // display on kml on map
  async getKmltoroute() {
    let objects = [];
    await this.kmlroutes.forEach( async (obj) => {
      console.log("1426", obj.geojsonline_file)
      const line = new L.GeoJSON.AJAX(obj.geojsonline_file, {
        style: function (feature) {
          return { color: obj.color };
        },
      });
      objects = objects.concat(line);
      
    });

    //console.log(1437, objects)
    this.routelayerGroup = L.layerGroup(objects);
    this.routelayerGroup.addTo(this.map);
  }
}

//
// 93.......... {
//   "header": {
//     "gtfs_realtime_version": "2.0",
//     "incrementality": "FULL_DATASET",
//     "timestamp": "06:56:52",
//     "route_name": "blue",
//     "route_id": "00014",
//     "direction": "1",
//     "headsign": "HUA to TAO",
//     "runtime": "34"
//   },
//   "entity": {
//     "id": "blue-070346",
//     "vehicle": {
//       "trip": {
//         "trip_id": "070346",
//         "start_time_secs": "24210",
//         "end_time_secs": "26266",
//         "time_now_sec": "25012",
//         "start_time": "06:43:30",
//         "end_time": "07:17:46"
//       },
//       "position": {
//         "latitude": "13.74945882773",
//         "longitude": "100.563533787612"
//       }
//     }
//   }
// }

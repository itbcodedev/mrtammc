import { Component, OnInit ,Inject } from '@angular/core';
import { environment } from "../../../environments/environment";
import { WebsocketService} from '../../services/websocket.service'
import { DOCUMENT } from '@angular/common';

declare let L;


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  configfiles = environment.configfiles;
  apikey = 'OFCE5UCISN.A6u3fH6hKP.uhcTNtKFfk==';
  map: any;
  wsdata;
  wsDataArray = []
  constructor(@Inject(DOCUMENT) private document,
    private _websocket: WebsocketService) { }

  ngOnInit() {

    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = new L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = new L.tileLayer(landUrl, { attribution: thunAttrib });

    this.map = new L.map('map').setView([13.773125, 100.542462], 10);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    var baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap
    };

    function style (feature, latlng) {
        return L.circleMarker(latlng, {
                     radius: 2,
                     fillColor: "#ff7800",
                     color: "#ff0000",
                     weight: 1,
                     opacity: 1,
                     fillOpacity: 0.8
                 });
    };

    function blue_style (feature, latlng) {
        return L.circleMarker(latlng, {
                     radius: 2,
                     fillColor: "#ff7800",
                     color: "#0000ff",
                     weight: 1,
                     opacity: 1,
                     fillOpacity: 0.8
                 });
    };

    function purple_style (feature, latlng) {
        return L.circleMarker(latlng, {
                     radius: 2,
                     fillColor: "#ff7800",
                     color: "#800080",
                     weight: 1,
                     opacity: 1,
                     fillOpacity: 0.8
                 });
    };


    const blue_geojsonLayer = new L.GeoJSON.AJAX("/assets/dist/kml/simulate_blueline.geojson",{
      pointToLayer: blue_style
    });
    blue_geojsonLayer.addTo(this.map);

    const purple_geojsonLayer = new L.GeoJSON.AJAX("/assets/dist/kml/simulate_purpleline.geojson",{
      pointToLayer: purple_style
    });
    purple_geojsonLayer.addTo(this.map);

    L.control.layers(baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
    let marker = new L.Marker();
    let icon = new L.icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'assets/leaflet/images/marker-icon.png',
            shadowUrl: 'assets/leaflet/images/leaflet/marker-shadow.png'
    })
    marker.setIcon(icon);
    // connect to listen to event
    const   ActiveTrain = {}
    const   StationMarkers = {}
    const   trainLocationMarkers = {}

    this._websocket.listen('gtfsrt_realtime').subscribe(data => {
      // tracking object
      this.handleData(ActiveTrain, StationMarkers, trainLocationMarkers, data)

    })
  }

  handleData(ActiveTrain, StationMarkers, trainLocationMarkers, data) {
    data.timestamp = new Date();
    data.route_name = data['header']['route_name']
    data.headsign = data['header']['headsign']
    data.tripEntity = data['header']['tripEntity']
    //this.wsdata = JSON.stringify(data)
    this.wsDataArray.push(data)
    //console.log(this.wsDataArray)
    // 1 set data realtime
    const route_name = data['header']['route_name']
    const route_id = data['header']['route_id']
    const direction = data['header']['direction']
    const headsign = data['header']['headsign']
    const runtime = data['header']['runtime']
    const time_now_sec = data['entity']['vehicle']['trip']['time_now_sec']
    const start_time_secs = data['entity']['vehicle']['trip']['start_time_secs']
    const end_time_secs = data['entity']['vehicle']['trip']['end_time_secs']
    const start_time = data['entity']['vehicle']['trip']['start_time']
    const end_time = data['entity']['vehicle']['trip']['end_time']
    const trip_id = data['entity']['vehicle']['trip']['trip_id']
    // // TODO: display info on marker
    const tripEntity = data['entity']['id']
    const vehicle = data['entity']['vehicle']
    const latitude = data['entity']['vehicle']['position']['latitude']
    const longitude = data['entity']['vehicle']['position']['longitude']
    const stoptimes = data['entity']['vehicle']['stoptimes']
    const trainLatLng = new L.LatLng(latitude, longitude);


    const onTrainClick = (e) => {
      // get marker
      const marker = e.target
      const html = `
      <div class="card" style="width: 16rem;">
        <div class="card-header" style="background-color:${e.target.color}; padding: 0.5rem 0.15rem !important;">
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
           <div class="col-md-5">
             <p style="color: #ffffff; margin: 2px 0;">เส้นทาง</p>
             <p style="color: #ffffff; margin: 2px 0;">${e.target.headsign}</p>
             <p style="color: #ffffff; margin: 2px 0;">ขบวนรถ</p>
             <p style="color: #ffffff; margin: 2px 0;">${e.target.trip_id}</p>
           </div>
           <div class="col-md-3">
             <p style="color: #ffffff; margin: 2px 0;">เวลาที่ใช้</p>
             <p style="color: #ffffff; margin: 2px 0;">${e.target.runtime} m.</p>
           </div>
        </div>
      </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">สถานีถัดไป ${e.target.nextstop}</li>
          <li class="list-group-item">arrival: ${e.target.arrival_time} departure: ${e.target.departure_time}</li>
        </ul>
   </div>
      `
      const popup = e.target.getPopup();
      popup.setContent(html);
      popup.update();
      marker.openPopup();

      const buttonSubmit = L.DomUtil.get('button-submit');
      L.DomEvent.addListener(buttonSubmit, 'click', function (e) {
        this.map.setView(marker.getLatLng(), 16);
        L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(this.map);

        this.selectTripId = marker.tripEntity
        // console.log(this.selectTripId)
        //marker.closePopup();
      },this);  // point to this context
    }  // end function onMarkerClick display popup with button

    // ---------------------------------------------------------------------
    // check

    if (ActiveTrain.hasOwnProperty(tripEntity)) {
      // exist
      //console.log('exist', tripEntity)
      //console.log(trainLocationMarkers)

      if (trainLocationMarkers[tripEntity] !== undefined) {
        trainLocationMarkers[tripEntity].setLatLng(trainLatLng)
      }
    } else {
      // new
      //console.log('new', tripEntity)
      ActiveTrain[tripEntity] = vehicle
      //console.log('ActiveTrain 2 ....', ActiveTrain)
      //// TODO: 1 create marker
      let marker = this.createMarker(trainLatLng, route_name)
      marker.addTo(this.map).bindPopup(`${tripEntity}`)
      // marker function
      marker.tripEntity = tripEntity
      marker.trip_id = trip_id
      marker.start_time = start_time
      marker.end_time = end_time
      marker.direction = "North"
      marker.stoptimes = stoptimes
      marker.color = this.getColor(route_name)
      marker.headsign = headsign
      marker.runtime = runtime
      marker.bindPopup("Trip info");
      //marker.on('mouseover', onTrainClick, marker);
      marker.on("click", function(event) {
          //this.map.flyTo(marker.getLatLng())
          this.map.setView(marker.getLatLng(), 16);

          L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
          }).addTo(this.map);

          this.selectTripId = marker.tripEntity
          //this.map.panTo(marker.getLatLng())

      }, this);

      trainLocationMarkers[tripEntity] = marker

      marker.on('mouseover', onTrainClick,this);
      marker.on('mouseout', onTrainClick,this );
    }
  }
  getColor(color) {
    switch (color) {
      case 'orange':
        return 'orange';
      case 'green':
        return 'green';
      case 'blue':
        return 'blue';
      case 'purple':
        return 'purple';
      case 'blue':
        return 'blue';
      default:
        return 'white';
    }
  }
  createMarker(latlng, color) {
    return new L.CircleMarker(latlng, {
      radius: 8,
      fillOpacity: 0.8,
      color: 'black',
      fillColor: this.getColor(color),
      weight: 2
    });
  }
}

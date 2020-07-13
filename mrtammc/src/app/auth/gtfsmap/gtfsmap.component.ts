import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GtfsService } from '../../services/gtfs2.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
//
import { RouteformatService } from '../../services/routeformat.service'
import { KmltorouteService } from '../../services/kmltoroute.service';
import {FileSaverService} from 'ngx-filesaver';


declare var path: any;

declare let L;

@Component({
  selector: 'app-gtfsmap',
  templateUrl: './gtfsmap.component.html',
  styleUrls: ['./gtfsmap.component.scss']
})
export class GtfsmapComponent implements OnInit {
  map
  stops
  baseLayers
  selectedStop
  allStops = {}
  isLogin
  kmlroutes
  routformats

  allstations
  routes

  stopForm: FormGroup
  submitted = false;
  buttonClicked: string;
  constructor(
    private fb: FormBuilder,
    private gtfsService: GtfsService,
    private toastr: ToastrService,
    private routeformatservice: RouteformatService,
    private fileSaverService: FileSaverService,
    private _kmltorouteservice: KmltorouteService) {
    this.stopForm = this.fb.group({
      stop_id: ['', Validators.required],
      stop_name: ['', Validators.required],
      stop_lat: ['', Validators.required],
      stop_lon: ['', Validators.required],
      stop_url: '',
      icon: ['', Validators.required]
    })
  }

  async ngOnInit() {
    this.isLogin = true
    this.loadbaselayers()

    L.control.layers(this.baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
    //Load data
    // this.loadGeojson()

    // console.log(this.allStops)
    await this.getstations();
    this.getRouteformat();
    this.getKmltoroute();
    // get stop
    this.stops = await this.gtfsService.getStops();
    await this.loadStation()
  }

  async getKmltoroute() {
    this.kmlroutes = await this._kmltorouteservice.getkmltoroute().toPromise()
    this.kmlroutes.forEach(obj => {
      console.log("138", obj.geojsonline_file)
      const line = new L.GeoJSON.AJAX(obj.geojsonline_file, {
        style: function (feature) {
          return { color: obj.color }
        }
      })

      line.addTo(this.map)
    })
  }

  getstations() {
    this.gtfsService.getallstations().then(obj => {
      this.allstations = obj
      console.log("95", this.allstations)
      this.routes = Object.keys(obj)
      console.log("97", this.routes) // Array ["BL", "CEN", "E-", "E", "N", "OR", "PP"]
    })
  }

  getRouteformat() {
    this.routeformatservice.getrouteformat().subscribe(result => {
      console.log("115", result)
      this.routformats = result
    }, (error) => {
      console.log(error)
    })
  }


  loadbaselayers() {
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = new L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = new L.tileLayer(landUrl, { attribution: thunAttrib });

    const googleStreets = new L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.map = new L.map('map').setView([13.76346247154659, 100.53527228372589], 12);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    this.baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap,
      "googleStreets": googleStreets,
      "googleHybrid": googleHybrid,
      "googleSat": googleSat,
      "googleTerrain": googleTerrain
    };
    let icon = new L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: './assets/leaflet/images/marker-icon-red.png'
    });
    this.map.on('click', (e) => {
      let newmarker = new L.marker(e.latlng, { draggable: 'true' }).addTo(this.map);
      newmarker.setIcon(icon)
      this.stopForm.setValue({
        stop_id: '',
        stop_name: '',
        stop_lat: e.latlng.lat,
        stop_lon: e.latlng.lng,
        stop_url: '',
        icon: ''
      })
      newmarker.on('dragend', (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        marker.setLatLng(new L.LatLng(position.lat, position.lng));
        this.stopForm.setValue({
          stop_id: '',
          stop_name: '',
          stop_lat: position.lat,
          stop_lon: position.lng,
          stop_url: '',
          icon: ''
        })
      });
      newmarker.on('dblclick', (event) => {
        const marker = event.target;
        this.map.removeLayer(marker)
        this.stopForm.setValue({
          stop_id: '',
          stop_name: '',
          stop_lat: '',
          stop_lon: '',
          stop_url: '',
          icon: ''
        })
      })
      newmarker.on('click', (event) => {
        const marker = event.target;
        this.map.removeLayer(marker)
        this.stopForm.setValue({
          stop_id: '',
          stop_name: '',
          stop_lat: '',
          stop_lon: '',
          stop_url: '',
          icon: ''
        })
      })
    });


  }

  addMarker(e) {
    // Add marker to map at click location; add popup window
    var newMarker = new L.marker(e.latlng).addTo(this.map);
  }


  loadGeojson() {

    // load geojson with new L.GeoJSON()
    const purple_line = new L.GeoJSON.AJAX("/assets/dist/kml/purple.geojson", {
      style: function (feature) {
        return {
          color: "purple"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_line = new L.GeoJSON.AJAX("/assets/dist/kml/blue.geojson", {
      style: function (feature) {
        return {
          color: "#214374"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_chalearm_line = new L.GeoJSON.AJAX("/assets/dist/kml/blue_chalearm.geojson", {
      style: function (feature) {
        return {
          color: "#2a5491"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_extend_line = new L.GeoJSON.AJAX("/assets/dist/kml/blue_extend.geojson", {
      style: function (feature) {
        return {
          color: "#7f98bd"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const orange_line = new L.GeoJSON.AJAX("/assets/dist/kml/orange.geojson", {
      style: function (feature) {
        return {
          color: "#FF6600"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const dark_green_line = new L.GeoJSON.AJAX("/assets/dist/kml/dark_green.geojson", {
      style: function (feature) {
        return {
          color: "#458B00"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const light_green_line = new L.GeoJSON.AJAX("/assets/dist/kml/light_green.geojson", {
      style: function (feature) {
        return {
          color: "#66CD00"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const light_green_extend_line = new L.GeoJSON.AJAX("/assets/dist/kml/light_green_extend.geojson", {
      style: function (feature) {
        return {
          color: "#66CD00"
        };
      }
    });
    blue_line.addTo(this.map);
    purple_line.addTo(this.map);
    blue_chalearm_line.addTo(this.map);
    blue_extend_line.addTo(this.map);
    orange_line.addTo(this.map);
    dark_green_line.addTo(this.map);
    light_green_line.addTo(this.map);
    light_green_extend_line.addTo(this.map);
  }

  getstationicon(stopid) {
    let route
    this.routes.forEach((key, index) => {
      let arrays = []
      this.allstations[key].forEach(record => {
        // console.log("105",record.station)
        arrays.push(record.station)
      })
      // console.log("107", key, arrays)
      const result = arrays.includes(stopid) ? key : null
      if (result !== null) {
        route = result
        //console.log("122", index, stopid, route)
      }
    });
    return route
  }

  async loadStation() {

    // this.stops = await this.gtfsService.getStops();
    console.log("234", this.stops)

    this.stops.forEach((stop, index) => {
      // get station icon path
      const route = this.getstationicon(stop.stop_id.trim());

      this.allStops[stop.stop_id] = stop

      let stopicon = ""
      let station_icon
      if (route === undefined || route === null) {
        // default
        stopicon = environment.iconbase + stop.icon
        console.log("256", route, stop.stop_id, stopicon)
      } else {

        this.routformats.forEach(obj => {

          if (obj.route == route) {
            station_icon = "." + obj.station_icon
          }
        })
        console.log("261", route, stop.stop_id, station_icon)
        if (station_icon === undefined || station_icon === null) {
          stopicon = environment.iconbase + stop.icon
        } else {
          stopicon = station_icon
        }

      }
      // icon
      const icon = new L.icon({
        iconSize: [22, 22],
        // iconAnchor: [0, 0],
        iconUrl: stopicon
      });
      // location
      console.log("276", stop.stop_lat, stop.stop_lon)
      const stationLatLng = new L.LatLng(stop.stop_lat, stop.stop_lon);
      var marker = new L.marker(stationLatLng, {
        draggable: 'true'
      });

      // action on marker
      marker.setIcon(icon);
      // marker.setLatLng(stationLatLng);
      //marker.setLatLng(stationLatLng)
      marker.addTo(this.map).bindPopup(`${stop.stop_id}-${stop.stop_name}`);
      const position = marker.getLatLng();
      marker.setLatLng(new L.LatLng(position.lat, position.lng), {
        draggable: 'true'
      });
      //add stop_id to marker
      marker.stop_id = stop.stop_id
      //dragged event
      marker.on('click', (event => {
        const marker = event.target;
        this.selectedStop = this.allStops[marker.stop_id]
        this.stopForm.setValue({
          stop_id: this.selectedStop.stop_id,
          stop_name: this.selectedStop.stop_name,
          stop_lat: this.selectedStop.stop_lat,
          stop_lon: this.selectedStop.stop_lon,
          stop_url: this.selectedStop.stop_url,
          icon: this.selectedStop.icon
        })
      }))
      marker.on('dragend', (event) => {
        const marker = event.target;
        //console.log('308 new marker', marker.stop_id, marker)
        // this.selectedMarker = marker
        const position = marker.getLatLng();
        //console.log('311 new position', position)
        marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
        // map.panTo(new L.LatLng(position.lat, position.lng))
        this.allStops[marker.stop_id].stop_lat = position.lat
        this.allStops[marker.stop_id].stop_lon = position.lng


        this.selectedStop = this.allStops[marker.stop_id]

        this.gtfsService.updateStops(this.selectedStop)

      });

    })
  }

  onstopSubmit() {
    if (this.buttonClicked == 'update') {
      console.log('update')
      this.submitted = true;
      // stop here if form is invalid
      if (this.stopForm.invalid) {
        return;
      }
      this.gtfsService.updateStops(this.stopForm.value).then((result: any) => {
        let msg = result.message
        this.toastr.success('ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว', msg, {
          timeOut: 3000
        });
      })
    } else if (this.buttonClicked == 'delete') {
      this.gtfsService.deleteStops(this.stopForm.value.stop_id).then((result: any) => {
        let msg = result.message
        this.toastr.success('ลบข้อมูลเรียบร้อยแล้ว', msg, {
          timeOut: 3000
        })
        console.log('delete click')
      })
    } else {
      console.log('add ')
      if (this.stopForm.invalid) {
        alert("Missing Field: กรุณากรอกข้อมูลให้ครบถ้วน")
        return;
      } else {
        this.gtfsService.createStops(this.stopForm.value).then((result: any) => {
          let msg = result.message
          this.toastr.success('ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว', msg, {
            timeOut: 3000
          });
        })
      }

    }

    this.update()
  }

  async update() {
    this.stops = await this.gtfsService.getStops();
    await this.loadStation()
    this.stopForm.setValue({
      stop_id: "",
      stop_name: "",
      stop_lat: "",
      stop_lon: "",
      stop_url: "",
      icon: ""
    })
    this.ngOnInit();
  }

  // convert Json to CSV data in Angular2
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  async dumpToText() {
    this.stops = await this.gtfsService.getStops()
    const result = this.stops.map(obj => {
      return {
        agency_key: obj.agency_key,
        stop_id: obj.stop_id,
        stop_name: obj.stop_name,
        stop_lat: obj.stop_lat,
        stop_lon: obj.stop_lon,
        zone_id: obj.zone_id,
        stop_url: obj.stop_url,
        icon: obj.icon
      }
    })

    // const csvData = this.ConvertToCSV(result);
    let buffer = JSON.stringify(result,null,2)
    let datetime = new Date().toISOString().split('T')[0];

    this.fileSaverService.save(new Blob([buffer], {type: "application/json"}), `${datetime}-stations.json`)
    // fs.writeFile('./assets/masterdb/backupfile.json', JSON.stringify(csvData,null,2), err => {
    //   if (err) {
    //     return console.error(err);
    //   }
    //   console.log("File created!");
    // });
    //console.log(csvData)
  }


}

//edit

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
//import { CctvserviceService } from '../../services/cctvservice.service';
import { CctvService } from '../../services/cctv.service';
import { GtfsService } from '../../services/gtfs2.service';
import { RouteformatService } from '../../services/routeformat.service'
import { environment } from '../../../environments/environment';
import { KmltorouteService } from '../../services/kmltoroute.service';

import * as jsmpeg from 'jsmpeg';
declare let L;
declare var $: any;


import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-cctv',
  templateUrl: './cctv.component.html',
  styleUrls: ['./cctv.component.scss']
})
export class CctvComponent implements OnInit {
  mycasvas: any;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  map: any;
  cctvlocations: any;
  geojson_route
  stops
  allstations
  routes
  routformats
  kmlroutes
  

  constructor(private _cctv: CctvService,
    @Inject(DOCUMENT) private document: Document,
    private gtfsService: GtfsService,
    private routeformatservice: RouteformatService,
    private _kmltorouteservice: KmltorouteService,
    elementRef: ElementRef) {
  }

  async ngOnInit() {
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = L.tileLayer(landUrl, { attribution: thunAttrib });

    this.map = L.map('map').setView([13.704654, 100.558345], 10);
    this.map.panTo([13.704654, 100.558345]);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    var baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap
    };

    L.control.layers(baseLayers).addTo(this.map);

    this.getstations();
    this.getRouteformat();


    // this.loadGeojson();
    // this.showAllgeojson();

    this.getKmltoroute();

    this.stops = await this.gtfsService.getStops();
    await this.loadStation()

    this.gtfsService.getallstations().then(obj => {
      this.allstations = obj
      console.log(this.allstations)
      this.routes = Object.keys(obj)
      console.log(this.routes)
    })

  }

  async getKmltoroute() {
    this.kmlroutes = await this._kmltorouteservice.getkmltoroute().toPromise()
    this.kmlroutes.forEach(obj => {
      console.log("138", obj.geojsonline_file)
      const line = new  L.GeoJSON.AJAX(obj.geojsonline_file ,{
        style: function (feature) {
          return { color: obj.color }
        }
      })

      line.addTo(this.map)
    })
  }


  ngAfterViewInit() {
    this.getCctv();
    //console.log(this.canvas.nativeElement);
    const ws = new WebSocket("ws://192.168.3.48:5000")
    const canvas = this.canvas.nativeElement;
    var player = new jsmpeg(ws, { canvas: canvas, autoplay: true, audio: false, loop: true });
  }


  getstations() {
    this.gtfsService.getallstations().then(obj => {
      this.allstations = obj
      console.log("95", this.allstations)
      this.routes = Object.keys(obj)
      console.log("97", this.routes) // Array [ "BL", "PP" ]
    })
  }

  getRouteformat() {
    this.routeformatservice.getrouteformat().subscribe(result => {
      // console.log("115", result)
      this.routformats = result
    }, (error) => {
      console.log(error)
    })
  }

  getstationicon(stopid) {
    let route
    this.routes.forEach((key,index) => {
      let arrays = []
      this.allstations[key].forEach(record => {
        // console.log("105",record.station)
        arrays.push(record.station)
      })
      // console.log("107", key, arrays)
      const result  = arrays.includes(stopid) ? key : null
      if (result !== null) {
        route = result
        //console.log("122", index, stopid, route)
      }
      
      
    });
    return route
  }



  async loadStation() {
    console.log("124", this.routformats )
    this.stops.forEach((stop,index) => {
      // get station icon path
      const route = this.getstationicon(stop.stop_id.trim());

      // console.log("128 ===================", index,  stop.stop_id, route)
      let stopicon = ""
      let station_icon
      if (route === undefined || route === null) {
        // default
        stopicon = environment.iconbase + stop.icon
        console.log("133", route, stop.stop_id, stopicon)
      } else {

        this.routformats.forEach(obj => {
          
          if (obj.route == route) {
            station_icon = "."+obj.station_icon
          }
        })
        console.log("140", route, stop.stop_id,  station_icon)
        if  (station_icon === undefined || station_icon === null) {
          stopicon = environment.iconbase + stop.icon
        } else {
          stopicon = station_icon
        }
        
      }

      const icon = new L.icon({
        iconSize: [22, 22],
        // iconAnchor: [0, 0],
        iconUrl: stopicon
      });
      // location
      const stationLatLng = new L.LatLng(stop.stop_lat, stop.stop_lon);
      const marker = new L.Marker();
      marker.setIcon(icon);
      marker.setLatLng(stationLatLng);
      marker.bindPopup('<img width=\'45\' src=\'' + '/assets/dist/img/loading.gif' + '\'/>');
      marker.stop_id = stop.stop_id;
      marker.stop_url = stop.stop_url;
      marker.stop_name = stop.stop_name;
      marker.addTo(this.map);

      async function onMarkerClick(e) {
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
            
              </div>
            </div>

          </div>

        `;
        const popup = e.target.getPopup();
        popup.setContent(html);
        popup.update();
      }  // end function onMarkerClick
      // cb to onMarkerClick
      marker.on('click', onMarkerClick, this);
    });
  }

  getCctv() {
    let get_cctv = this._cctv.getCctv()
    get_cctv.subscribe((datas) => {
      console.log(datas);
      this.cctvlocations = datas;
      this.cctvlocations.forEach(cctv => {
        //let ws = new WebSocket(`${cctv.protocol}://${cctv.host}:${cctv.port}`);
        //console.log(ws);
        const marker = L.marker([cctv.latitude, cctv.longitude], {
          icon: L.AwesomeMarkers.icon({ icon: 'camera', prefix: 'fa', markerColor: 'blue' }),
          forceZindex: 100,
          url: `ws://192.168.3.48:${cctv.port}`
        });
        var customOptions = {
          'maxWidth': '700',
          'className': 'custom'
        }

        const html = `<table >
                          <tr>
                            <th class="tg-0lax">รหัส<br></th>
                            <th class="tg-0lax">${cctv.code}<br></th>
                          </tr>
                          <tr>
                            <td class="tg-0lax">ชื่อกล้อง</td>
                            <td class="tg-0lax">${cctv.name}</td>
                          </tr>
                          <tr>
                            <td class="tg-0lax">source host<br></td>
                            <td class="tg-0lax">${cctv.protocol}://${cctv.host}</td>
                          </tr>
                          <tr>
                            <td class="tg-0lax">stream port<br></td>
                            <td class="tg-0lax">ws://192.168.3.48:${cctv.port}</td>
                          </tr>
                          <tr>
                            <td colspan="2">

                            <canvas id="canvas" ></canvas>

                            </td>
                          </tr>
                        </table>`;

        const popup = L.popup().setContent(html);

        marker.bindPopup(popup, customOptions).openPopup()
          .on('popupopen', this.showcctv);
        marker.addTo(this.map);
        //this.mycasvas = this.document.getElementById("canvas");
        //console.log(this.mycasvas);
      });
    });
  }

  showcctv(e) {
    console.log(e);
    //console.log(e.latlng);
    //console.log(e.target.getPopup());
    //console.log(this.canvas.nativeElement);
    // var popup = e.target.getPopup();
    // var content = popup.getContent();
    // let xmldoc = $.parseXML(content)
    // let $xml  =$(xmldoc)
    // $xml.find("td").each( (index,elem) => {
    //   console.log(index, elem)
    // })
    // get source
    var marker = e.popup._source;
    console.log(marker.options.url);
    //console.log(this.document);
    //console.log($('#canvas'));
    //const ws = new WebSocket("ws://192.168.3.48:5000")
    const ws = new WebSocket(marker.options.url)
    $('#canvas').width(350);
    $('#canvas').height(260);
    var player = new jsmpeg(ws, { canvas: $('#canvas')[0], autoplay: true, audio: false, loop: true });
  }


  loadGeojson() {
    // load geojson with new L.GeoJSON()
    const purple_line = new L.GeoJSON.AJAX('/assets/dist/kml/purple.geojson', {
      style: function (feature) {
        return {
          color: 'purple'
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_line = new L.GeoJSON.AJAX('/assets/dist/kml/blue.geojson', {
      style: function (feature) {
        return {
          color: '#214374'
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_chalearm_line = new L.GeoJSON.AJAX('/assets/dist/kml/blue_chalearm.geojson', {
      style: function (feature) {
        return {
          color: '#2a5491'
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_extend_line = new L.GeoJSON.AJAX('/assets/dist/kml/blue_extend.geojson', {
      style: function (feature) {
        return {
          color: '#7f98bd'
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const orange_line = new L.GeoJSON.AJAX('/assets/dist/kml/orange.geojson', {
      style: function (feature) {
        return {
          color: '#FF6600'
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const dark_green_line = new L.GeoJSON.AJAX('/assets/dist/kml/dark_green.geojson', {
      style: function (feature) {
        return {
          color: '#458B00'
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const light_green_line = new L.GeoJSON.AJAX('/assets/dist/kml/light_green.geojson', {
      style: function (feature) {
        return {
          color: '#66CD00'
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const light_green_extend_line = new L.GeoJSON.AJAX('/assets/dist/kml/light_green_extend.geojson', {
      style: function (feature) {
        return {
          color: '#66CD00'
        };
      }
    });

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
        routes: ['00011', '00012']
      },
      blue_line: {
        geojson: blue_line,
        routes: []
      },
      blue_chalearm_line: {
        geojson: blue_chalearm_line,
        routes: ['00013', '00014']
      },
      blue_extend_line: {
        geojson: blue_extend_line,
        routes: []
      },
      orange_line: {
        geojson: orange_line,
        routes: []
      },
      dark_green_line: {
        geojson: dark_green_line,
        routes: []
      },
      light_green_line: {
        geojson: light_green_line,
        routes: []
      },
      light_green_extend_line: {
        geojson: light_green_extend_line,
        routes: []
      }
    };


  }

  showAllgeojson() {
    const allgeojson = this.geojson_route;
    const keys = Object.keys(allgeojson);
    // console.log(keys)
    keys.forEach(obj => {
      allgeojson[obj].geojson.addTo(this.map);
    });
  }
}

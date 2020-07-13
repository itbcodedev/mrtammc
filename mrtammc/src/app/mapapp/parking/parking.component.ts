import { Component, OnInit,Renderer2, Inject } from '@angular/core';
import { ParkingserviceService } from '../../services/parkingservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
// import { GtfsService } from '../../services/gtfs.service';
import { GtfsService } from '../../services/gtfs2.service';
import { Shape } from '../../models/shape.model';
import { ShapeDetail } from '../../models/shape_detail';
import { forkJoin } from "rxjs/observable/forkJoin";
import { environment } from '../../../environments/environment';
import { RouteformatService } from '../../services/routeformat.service'
import { RatioparkingService } from '../../services/ratioparking.service'
import { KmltorouteService } from '../../services/kmltoroute.service';


declare let L;

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss']
})
export class ParkingComponent implements OnInit {
  processStyle
  parkings: any;
  parkinglocations: any;
  apikey = 'OFCE5UCISN.A6u3fH6hKP.uhcTNtKFfk==';
  map: any;
  shapes: Shape[];
  tripPath: any;
  markers = [];
  isLow = false;
  isMedium = false;
  isHigh = true;
  totoalncarrem = 0;
  totalcapacity = 0;
  parkingclass = {
    "parking-1": this.isLow,
    "parking-2": this.isMedium,
    "parking-3": this.isHigh
  }

  geojson_route
  stops
  routes
  allstations
  routformats
  ratioparking: any
  myclass
  ratiolabel
  kmlroutes


  constructor(public _parking: ParkingserviceService,
    private gtfsService: GtfsService,
    @Inject(DOCUMENT) private document,
    private renderer: Renderer2,
    private _router: Router,
    private routeformatservice: RouteformatService,
    private _ratioparkingservice: RatioparkingService,
    private _kmltorouteservice: KmltorouteService
  ) { }

  async ngOnInit() {

    this.myclass = "red"

    this._ratioparkingservice.getratioparking().subscribe(result => {
      
      let output: any  = result
      // sort from min to max
      this.ratioparking = output.sort((a, b) => (parseInt(a.percent) > parseInt(b.percent)) ? 1 : -1)
      console.log("67",this.ratioparking[0])
    }, (error) => {
      console.log(error)
    })
    
    
    //this.renderer.removeClass(this.document.body, 'sidebar-open');
    //this.renderer.addClass(this.document.body, 'sidebar-collapse');
    this.document.location.hostname;
    console.log(this.document.location.hostname);

    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = L.tileLayer(landUrl, { attribution: thunAttrib });

    this.map = L.map('map').setView([13.812137914676734, 100.49212238477799], 12);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    var baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap
    };

    L.control.layers(baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
    // this.getShapes();
    this.getlocation();
    this.getParking();
    // load map
    this.getstations();
    this.getRouteformat();
    // this.loadGeojson();
    // this.showAllgeojson();
    this.getKmltoroute();
    
    this.stops = await this.gtfsService.getStops();
    console.log("87", this.stops)
    await this.loadStation()

    
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


  getParking() {
    console.log("139", "getParking")
    // return observable
    let get_parking = this._parking.getParking();
    let get_location = this._parking.getParkinglocation();
    // subscribe to observable

    get_location.subscribe(result=> {
      console.log("145", result)
    })

    forkJoin([get_parking, get_location]).subscribe(result=>{
      console.log("148", result);
      this.parkinglocations = result[1];
      this.parkings = result[0];

      console.log("152",this.parkings);
      this.parkings.forEach(parking => {
        this.totoalncarrem += +parking.ncarrem
        parking.ncarrem = parking.ncarrem < 0 ? 0 : parking.ncarrem

        this.parkinglocations.forEach(pl => {
          if (parking.code == pl.code) {
            parking.capacity = pl.capacity
            parking.icon = pl.icon
            this.totalcapacity += pl.capacity
          }
        });

        parking.percent = Math.round(((parking.capacity - parking.ncarrem)/parking.capacity)*100);

        if (this.ratioparking.length == 0) {
          this.ratiolabel = "green (<30%) yellow (30%-70%) red (>70%)"
          switch (true) {
            case (parking.percent < 30 ):
              parking.class= "green"
              break;
            case (parking.percent >= 30  && parking.percent < 70):
              parking.class="yellow"
              break;
            case (parking.percent >= 70  && parking.percent <= 100 ):
              parking.class="red"
              break;
            default:
              break;
          }
        } else {
          let one = this.ratioparking[0].color + " " + this.ratioparking[0].percent + " > "
          let two = this.ratioparking[1].color + " " + this.ratioparking[1].percent + " > "
          let three = this.ratioparking[2].color + " " + this.ratioparking[2].percent + " > "
          let four = this.ratioparking[3].color + " " + this.ratioparking[3].percent + " > "
          let five = this.ratioparking[4].color + " " + this.ratioparking[4].percent + " "

          this.ratiolabel = one + two + three + four + five
          switch (true) {
            case (parking.percent < this.ratioparking[0].percent ):
              parking.class= this.ratioparking[0].color
              break;
            case (parking.percent >= parseInt(this.ratioparking[0].percent)  && parking.percent < parseInt(this.ratioparking[1].percent)):
              console.log(parking.icon)
              parking.class=this.ratioparking[1].color
              break;
            case (parking.percent >= parseInt(this.ratioparking[1].percent)  && parking.percent < parseInt(this.ratioparking[2].percent) ):
              console.log(parking.icon)
              parking.class=this.ratioparking[2].color
              break;
            case (parking.percent >= parseInt(this.ratioparking[2].percent)  && parking.percent < parseInt(this.ratioparking[3].percent) ):
              console.log(parking.icon)
              parking.class=this.ratioparking[3].color
              break;
            case (parking.percent >= parseInt(this.ratioparking[3].percent)  && parking.percent <= parseInt(this.ratioparking[4].percent) ):
              console.log(parking.icon)
              parking.class=this.ratioparking[4].color
              break;
            default:
              break;
          }
        }

        parking.ncarrem = parking.ncarrem < 0 ? "Full" : parking.ncarrem;
      });

      this._parking.totoalncarrem = this.totoalncarrem;
      this._parking.totalcapacity = this.totalcapacity;


    });
  }

  getcss() {
    let css = `
    leve1::-webkit-progress-value {
      background: #cc3232;
    }
    
    leve1::-moz-progress-bar {
      background: #cc3232;
    }
    
    leve1::-ms-fill {
      background: #cc3232;
    }
    
    `;
    return  css
  }

  getlocation() {
    this._parking.getParkinglocation()
    .subscribe(data => {
      this.parkinglocations = data;
      // console.log(this.parkinglocations);
      this.parkinglocations.forEach(parking => {
        const marker = L.marker([parking.latitude, parking.longitude],{
             icon: L.AwesomeMarkers.icon({icon: 'car', prefix: 'fa', markerColor: 'blue'}),
             forceZindex: 100
        });
        const customOptions ={
                            'maxWidth': '500',
                            'className' : 'tg'
                            }
        const popup =  `<table class="tg">
                          <tr>
                            <th class="tg-0lax">รหัส<br></th>
                            <th class="tg-0lax">${parking.code}<br></th>
                          </tr>
                          <tr>
                            <td class="tg-0lax">ชื่อสถานี</td>
                            <td class="tg-0lax">${parking.name}</td>
                          </tr>
                          <tr>
                            <td class="tg-0lax">จำนวนที่จอด<br></td>
                            <td class="tg-0lax">${parking.capacity} คัน</td>
                          </tr>
                          <tr>
                            <td colspan="2">
                            <img src="${parking.image}" style="width:300px;height:200px;" />
                            </td>
                          </tr>
                        </table>`;
        marker.bindPopup(popup,customOptions);
        marker.addTo(this.map);
        this.markers.push({ code: parking.code, markers: marker});
      });
    })

  }




  async getShapes() {
    const shapes: Shape[] = await this.gtfsService.getShapes();
    
    const shape_details: ShapeDetail[] = await this.gtfsService.getShapeDetail();
    this.shapes = shapes;
    console.log(shapes)
    console.log(shape_details)
    const grouped = this.groupBy(shapes, shape => shape.shape_id);
  
    grouped.forEach((values, key) => {
      const color = shape_details.find(shape_detail => shape_detail.shape_id === key).color;
      const coordinates = [];
      for (const shape of values) {
        const point = new L.LatLng(shape.shape_pt_lat, shape.shape_pt_lon)
        coordinates.push(point);
      }
      console.log(color);
      console.log(coordinates)
      const polyline =  L.polyline(coordinates, {color: `#${color}`})
      polyline.addTo(this.map)
    });
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

  getparkcode(parking) {
    //console.log(parking.code);
    //console.log(this.markers);
    const obj = this.markers.find(m =>  m.code == parking.code)
    obj.markers.openPopup();
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

  getstations() {
    this.gtfsService.getallstations().then(obj => {
      this.allstations = obj
      console.log("95", this.allstations)
      this.routes = Object.keys(obj)
      console.log("97", this.routes) // Array [ "BL", "PP" ]
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

  getRouteformat() {
    this.routeformatservice.getrouteformat().subscribe(result => {
      console.log("115", result)
      this.routformats = result
    }, (error) => {
      console.log(error)
    })
  }

  

  async loadStation() {
    console.log("loadStation")
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
}

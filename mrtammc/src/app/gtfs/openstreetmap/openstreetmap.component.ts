import { Component, OnInit, Renderer2, Inject } from '@angular/core';
// import { GtfsService } from '../../services/gtfs.service';
import { GtfsService } from '../../services/gtfs2.service';
import { GtfsrtwsService } from '../../services/gtfsrtws.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';

declare let L;

import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-openstreetmap',
  templateUrl: './openstreetmap.component.html',
  styleUrls: ['./openstreetmap.component.scss'],
})
export class OpenstreetmapComponent implements OnInit {
  map: any;
  activeTrains: any;
  wsdata;
  path;
  CurrentDate;
  // csvUrl = 'assets/tubemapdata/testlatlng.csv';
  csvUrl = 'assets/tubemapdata/purplecoordinate.csv';
  //purple_csvUrl = 'assets/tubemapdata/purplecoordinate.csv';
  //blue_csvUrl = 'assets/tubemapdata/blueline_coordinate.csv';
  purple_csvUrl = 'assets/tubemapdata/purpledotmaptube.csv';
  blue_csvUrl = 'assets/tubemapdata/bluedotmaptube.csv';
  // array store data
  csvData: any[] = [];
  blue_csvData: any[] = [];

  purplestations = [
    {
      station: 'คลองบางไผ่',
      code: 'PP01',
      distance: 0,
      location: [50.05, 730.6],
    },
    {
      station: 'ตลาดบางใหญ่',
      code: 'PP02',
      distance: 1.26,
      location: [50.05, 713.94],
    },
    {
      station: 'สามแยกบางใหญ่',
      code: 'PP03',
      distance: 2.94,
      location: [60.93, 697.94],
    },
    {
      station: 'บางพูล',
      code: 'PP04',
      distance: 4.5,
      location: [86.8, 697.94],
    },
    {
      station: 'บางรักใหญ่',
      code: 'PP05',
      distance: 5.69,
      location: [112.07, 697.94],
    },
    {
      station: 'ท่าอิฐ',
      code: 'PP06',
      distance: 6.97,
      location: [138.44, 697.94],
    },
    {
      station: 'ไทรม้า',
      code: 'PP07',
      distance: 8.2,
      location: [164.07, 697.94],
    },
    {
      station: 'สะพานพระนั่งเกล้า',
      code: 'PP08',
      distance: 9.68,
      location: [192.43, 697.94],
    },
    {
      station: 'แยกนนทบุรี 1',
      code: 'PP09',
      distance: 11.3,
      location: [221.82, 697.94],
    },
    {
      station: 'ศรีพรสวรรค์',
      code: 'PP10',
      distance: 12.5,
      location: [249.01, 697.94],
    },
    {
      station: 'ศูนย์ราชการนนทบุรี',
      code: 'PP11',
      distance: 13.5,
      location: [275.75, 697.94],
    },
    {
      station: 'กระทรวงสาธารณสุข',
      code: 'PP12',
      distance: 15.5,
      location: [329.24, 663.61],
    },
    {
      station: 'แยกติวานนท์',
      code: 'PP13',
      distance: 16.9,
      location: [349.13, 644.13],
    },
    {
      station: 'แยกวงค์สว่าง',
      code: 'PP14',
      distance: 18.5,
      location: [356.97, 619.88],
    },
    {
      station: 'บางซ่อน',
      code: 'PP15',
      distance: 19.9,
      location: [356.97, 591.64],
    },
    {
      station: 'เตาปูน',
      code: 'PP16',
      distance: 21.5,
      location: [356.97, 562.77],
    },
  ];
  purple_points = [];
  blue_points = [];
  group1;
  myTrains;
  notfollow = true;

  constructor(
    @Inject(DOCUMENT) private document,
    private renderer: Renderer2,
    private _gtfsws: GtfsrtwsService,
    private gtfsService: GtfsService,
    private http: HttpClient
  ) {}

  readCsvData(csvUrl) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain; charset=utf-8'
    );
    return this.http
      .get(csvUrl, { headers, responseType: 'text' })
      .toPromise()
      .then(
        (res) => this.extractData(res),
        (err) => this.handleError(err)
      );
  }

  private extractData(res) {
    let csvData = res || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');
    console.log(allTextLines.length);

    let lines = [];

    for (let i = 0; i < allTextLines.length; i++) {
      // split content based on comma
      let data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        let tarr = [];
        for (let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        lines.push(tarr);
      }
    }
    // this.csvData = lines;
    return lines;
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    console.error(errMsg); // log to console instead
    return errMsg;
  }

  async ngOnInit() {
    // this.renderer.removeClass(this.document.body, 'sidebar-open');
    // this.renderer.addClass(this.document.body, 'sidebar-collapse');
    this.loadStation();
    this.csvData = await this.readCsvData(this.purple_csvUrl);
    this.csvData.shift(); // remove first row

    this.blue_csvData = await this.readCsvData(this.blue_csvUrl);
    this.blue_csvData.shift(); // remove first row

    this.map = L.map('map', {
      crs: L.CRS.Simple, // important display as flat xy not map
      center: [300, 240],
      zoom: 1,
    });

    // const LatLng = new L.LatLng(197.91, 81.37);
    // const testMaker = L.circle(LatLng, {
    //   color: '#000000',
    //   fillColor: '#f400ff',
    //   fillOpacity: 1,
    //   radius: 5,
    // });
    // testMaker.addTo(this.map);

    // Test show marker
    // this.csvData.forEach( obj => {
    //   const LatLng = new L.LatLng(obj[2], obj[1])
    //   const testMaker = L.circle(LatLng,{
    //       color: "#000000",
    //       fillColor: "#f400ff",
    //       fillOpacity: 1,
    //       radius: 2
    //   });
    //   testMaker.addTo(this.map)
    // })

    L.Icon.Default.imagePath = './assets/leaflet/images/';

    const lefttrain = L.icon({
      iconUrl: './assets/leaflet/images/left-train.svg',
      iconSize: [28, 25],
      iconAnchor: [14, 14],
      popupAnchor: [-3, -10],
    });
    const righttrain = L.icon({
      iconUrl: './assets/leaflet/images/right-train.svg',
      iconSize: [28, 25],
      iconAnchor: [14, 14],
      popupAnchor: [-3, -10],
    });

    // step 1 display tubemap  on csr
    const tubemap = './assets/dist/img/mrtatube.svg';
    const bounds = [
      [0, 0],
      [583.59, 594.6],
    ];
    L.imageOverlay(tubemap, bounds).addTo(this.map).bringToBack();
    // const point = L.circle([730.6, 50], { color: 'green', radius: 4 }).addTo(map);
    // 0,0 to bottum left
    const purple = [
      [28.02, 447.1],
      [28.02, 426.7],
      [180, 426.8],
      [281.7, 387.73],
      [281.7, 343.2],
    ];
    const blue = [
      [357.04, 563.27],
      [479.55, 563.27],
      [479.55, 616.77],
      [533.86, 616.77],
      [598.86, 551.26],
      [598.86, 361.9],
      [421.2, 361.9],
    ];

    this.group1 = L.featureGroup();
    this.group1.addTo(this.map);

    const ActiveTrain = {};
    const trainLocationMarkers = {};

    // get data from web socket

    // get Realtime data
    this._gtfsws.listen('gtfsrt').subscribe(async (data) => {
      this.wsdata = JSON.stringify(data, null, 2);
      // // DEBUG: data from webservice
      // console.log('230..........', this.wsdata)

      const route_name = data['header']['route_name'];
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
      // // TODO: display info on marker
      const tripEntity = data['entity']['id'];
      const vehicle = data['entity']['vehicle'];
      const latitude = data['entity']['vehicle']['position']['latitude'];
      const longitude = data['entity']['vehicle']['position']['longitude'];
      const stoptimes = data['entity']['vehicle']['stoptimes'];

      // getdata
      const routeinfowithtrips = await this.gtfsService.getrouteinfowithtrip(
        trip_id
      );
      // filter again
      const routetrips = routeinfowithtrips.filter((obj) => {
        return this.checktime(obj.start_time, obj.end_time);
      });
      // debug
      // console.log('117....',trip_id,filter)
      const nextstation = routetrips.map((obj) => {
        const selectStoptimes = obj.stoptimes.filter((st_obj) => {
          // filter next time check depature_time less than timenow [0]
          return this.findNextTrip(st_obj.arrival_time);
        });
        obj.selectStoptimes = _.first(selectStoptimes);
        return obj;
      });

      // // DEBUG: success ? filter next station
      this.CurrentDate = moment();
      const timenow = this.CurrentDate.format('HH:mm:ss');
      const nexttrip = nextstation[0].selectStoptimes;
      const arr_time = this.getsecond(nexttrip.arrival_time);
      const arr_now = this.getsecond(timenow);
      nexttrip.difftime = (arr_time - arr_now).toFixed(2);
      // console.log('130....',nexttrip)
      // // TODO: filter with time select next station
      console.log(
        'time_now_sec - start_time_secs',
        time_now_sec,
        start_time_secs
      );
      const delta_t = time_now_sec - start_time_secs;

      const runtime_secs = runtime * 60;

      let loc_length;
      let loc_order;
      let position;
      let trainLocation;

      // select route_name and csvData to get location
      switch (route_name) {
        case 'purple':
          loc_length = this.csvData.length;
          loc_order = Math.round((delta_t / runtime_secs) * loc_length);
          // console.log('trip_id,delta_t,loc_order,loc_length',trip_id,delta_t,loc_order,loc_length)

          if (+direction) {
            console.log(+direction);
            position = this.csvData[loc_length - loc_order];
            trainLocation = new L.LatLng(position[2], position[1]);
          } else {
            console.log(+direction);
            position = this.csvData[loc_order];
            trainLocation = new L.LatLng(position[2], position[1]);
          }
          break;
        case 'blue':
          loc_length = this.blue_csvData.length;
          loc_order = Math.round((delta_t / runtime_secs) * loc_length);
          // console.log('trip_id,delta_t,loc_order,loc_length',trip_id,delta_t,loc_order,loc_length)

          if (+direction) {
            console.log(+direction);
            position = this.blue_csvData[loc_order];
            trainLocation = new L.LatLng(position[2], position[1]);
          } else {
            console.log(+direction);
            position = this.blue_csvData[loc_length - loc_order];
            trainLocation = new L.LatLng(position[2], position[1]);
          }
          break;
      }

      function onTrainClick(e) {
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
      } // end function onMarkerClick

      if (ActiveTrain.hasOwnProperty(tripEntity)) {
        // exist only update location
        console.log('update exist marker');
        if (trainLocationMarkers[tripEntity] !== undefined) {
          trainLocationMarkers[tripEntity].setLatLng(trainLocation);
          console.log(trainLocationMarkers[tripEntity]);
        }
      } else {
        // add new
        console.log('add new marker');
        ActiveTrain[tripEntity] = vehicle;
        //// TODO: 1 create marker
        // let marker = this.createMarker(trainLatLng, route_name)

        const marker = L.circle(trainLocation, {
          color: '#202020',
          fillColor: this.getColor(route_name),
          fillOpacity: 1,
          radius: 3,
        });

        marker.bindPopup('Trip info');
        marker.addTo(this.map).bindPopup(`${tripEntity}`);
        // marker function
        marker.trip_id = trip_id;
        marker.start_time = start_time;
        marker.end_time = end_time;
        marker.direction = direction;
        marker.stoptimes = stoptimes;
        marker.color = this.getColor(route_name);
        marker.headsign = headsign;
        marker.runtime = runtime;

        marker.nextstop = nexttrip.stop_id;
        marker.arrival_time = nexttrip.arrival_time;
        marker.departure_time = nexttrip.departure_time;
        marker.difftime = nexttrip.difftime;
        trainLocationMarkers[tripEntity] = marker;

        marker.on('click', onTrainClick);

        marker.on('mouseover', onTrainClick, this);
        marker.on('mouseout', onTrainClick, this);

        // marker.on('mouseover', onTrainClick, marker);
        marker.on(
          'click',
          function (event) {
            // this.map.flyTo(marker.getLatLng())
            this.map.setView(marker.getLatLng(), 3);
            this.selectTripId = marker.tripEntity;
            // this.map.panTo(marker.getLatLng())
          },
          this
        );
      }

      // check train over due
      for (let key in ActiveTrain) {
        if (time_now_sec > ActiveTrain[key]['trip']['end_time_secs']) {
          // console.log(`over due delete .. ${ActiveTrain[key]}`)
          delete ActiveTrain[key];
        } else {
          // console.log("not over due")
        }
      }

      // delete marker of overdue
      for (let key in trainLocationMarkers) {
        if (ActiveTrain.hasOwnProperty(key)) {
          // console.log(`${key} still on tracks`)
        } else {
          const marker = trainLocationMarkers[key];
          this.map.removeLayer(marker);
          // console.log(`${key} remove marker`)
          delete trainLocationMarkers[key];
        }
      }
    }); // end web service
  }

  timeToMidnight() {
    const time = new Date();
    const secs =
      +time.getHours() * 3600 + +time.getMinutes() * 60 + +time.getSeconds();
    // const secs = 20 * 3600 + +time.getMinutes() * 60 + +time.getSeconds();
    return secs;
  }

  // getposition function
  getPosition(arr) {
    const result = [];
    function pairwise(arr, func) {
      for (var i = 0; i < arr.length - 1; i++) {
        func(arr[i], arr[i + 1]);
      }
    }

    pairwise(arr, function (current, next) {
      // initialize
      let x0 = current[0];
      let y0 = current[1];
      let x1 = next[0];
      let y1 = next[1];
      // along x
      if (x1 == x0) {
        if (y1 < y0) {
          while (y0 >= y1) {
            const position = y0--;
            result.push([x1, position]);
          }
        } else {
          while (y0 <= y1) {
            const position = y0++;
            result.push([x1, position]);
          }
        }
      }
      // along y
      if (y1 == y0) {
        if (x1 < x0) {
          while (x0 >= x1) {
            const position = x0--;
            result.push([position, y1]);
          }
        } else {
          while (x0 <= x1) {
            const position = x0++;
            result.push([position, y1]);
          }
        }
      }
      //
      if (x1 != x0 && y1 != y0) {
        while (x0 <= x1) {
          const position_x = x0++;
          const position_y = y0--;
          result.push([position_x, position_y]);
        }
      }
    });
    return result;
  }

  checktime(start_time, endtime_time) {
    const format = 'hh:mm:ss';
    // Adjust time
    // const CurrentDate = moment().subtract('hours',5);
    const CurrentDate = moment();
    // console.log('CurrentDate........',  CurrentDate.format("HH:mm:ss"))
    // console.log('start_time',start_time)
    // console.log('endtime_time',endtime_time)
    let timenow = CurrentDate.format('HH:mm:ss');

    const time = moment(timenow, format);
    const at = moment(start_time, format);
    const dt = moment(endtime_time, format);

    if (time.isBetween(at, dt)) {
      return true;
    } else {
      return false;
    }
  }

  findNextTrip(arrival_time: any): any {
    const format = 'hh:mm:ss';
    // const CurrentDate = moment().subtract('hours',5);
    // console.log('CurrentDate........',  CurrentDate.format("HH:mm:ss"))
    const CurrentDate = moment();
    let timenow = CurrentDate.format('HH:mm:ss');

    // console.log('448........arrival_time < timenow',arrival_time,timenow )
    // // TODO: convert to sec
    const arrival_time_secs = this.getsecond(arrival_time);
    const timenow_secs = this.getsecond(timenow);

    // console.log('timenow_secs,arrival_time_secs',timenow_secs,arrival_time_secs)
    if (arrival_time_secs > timenow_secs) {
      // console.log('true')
      return true;
    } else {
      // console.log('false')
      return false;
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
    return new L.CircleMarker(latlng, {
      radius: 8,
      fillOpacity: 0.8,
      color: 'black',
      fillColor: this.getColor(color),
      weight: 2,
    });
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
        return '#AE1AF7';
      case 'blue':
        return 'blue';
      default:
        return 'white';
    }
  }

  getPathfile(route_name, direction) {
    const index = this.path.findIndex((c) => {
      return c.route_name == route_name && c.direction == direction;
    });
    if (index > -1) {
      // console.log('72 file.......', path.config[index].file)
      return this.path[index].file;
    }
  }

  loadStation() {
    const purpleUrl = 'assets/tubemapdata/purplestation.json';
    console.log(purpleUrl);
    const purplestation = this.http.get(purpleUrl).subscribe((data) => {
      console.log(data);
    });
  }
}

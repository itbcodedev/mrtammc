import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { IParkingData, Data } from './Data'
import { ParkingserviceService } from '../../services/parkingservice.service';
import { AlertService} from '../../services/alert.service';
import { AlertmobileService } from '../../services/alertmobile.service';
import { PassengerService } from '../../services/passenger.service'
import { UserServiceService } from '../../auth/user-service.service';
import { Alert } from './alert.model';
import {FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { WebsocketService} from '../../services/websocket.service'
import {GtfsService} from '../../services/gtfs2.service'
import * as moment from 'moment'; 

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})
export class StaticComponent implements OnInit {
  chart: any = []
  labels= []
  datasets=[]
  alerts: any
  mobilemessages: any
  alertForm: FormGroup;
  passengers
  average
  allpassengers
  gridApi
  gridColumnApi

  username
  isLogin

  routes
  allstations
  stations
  station

  stop_group
  stop_id
  
  @ViewChild('closeBtn', { static: true }) closeBtn: ElementRef;

  columnDefs = [
    {headerName: 'stop_group', field: 'stop_group'},
    {headerName: 'stop_id', field: 'stop_id'},
    {headerName: 'title_line', field: 'title_line'},
    {headerName: 'message', field: 'message'},
    {headerName: 'message_en', field: 'message'},
    {headerName: 'user_name', field: 'message'},
    {headerName: 'notify_date', field: 'notify_date'},
  ];

  rowData: any = [];
  

  constructor(private _http: HttpClient,
              public _parking: ParkingserviceService,
              public _alert: AlertService,
              public _mobile: AlertmobileService,
              public _passenger: PassengerService,
              private _toastr: ToastrService,
              private _websocket: WebsocketService,
              private _userservice: UserServiceService,
              private _gtfsservice: GtfsService,
              private fb: FormBuilder) { }


  pushToArray(arr, obj) {
    //// TODO: Fix 
    const existIds = arr.map( obj => obj.station)
    if ( ! existIds.includes(obj.station)) {
      arr.push(obj)
    } else {
      arr.forEach((element, index) => {
        if (element.station === obj.station) {
          arr[index] = obj
        }
      })
    }
  }


  ngOnInit() {

    this._userservice.getUserName().subscribe(
      data => {
        this.username = data.toString();
        console.log("Login as: ==================================")
        console.log(this.username)
        this.isLogin = true;
      }
    )
                                                                                                              
    this._gtfsservice.getallstations().then( obj => {
      this.allstations = obj
      console.log(this.allstations)
      this.routes = Object.keys(obj)
      console.log(this.routes)
    })

    this.alertForm = this.fb.group({
      stop_group: ['', Validators.required],
      stop_id: ['', Validators.required],
      title_line: ['', Validators.required],
      title_line_en: [''],
      notify_date: [''],
      message: ['', Validators.required],
      message_en: [''],
      user_name: ['']
    })

    this.getMobilemessage()
    this.getalerts()
    this.getPassenger()
    
   
    //this.getdata()
    this._websocket.listen('passenger').subscribe(data => {
        
        this.pushToArray(this.passengers, data)
        this.average = this.passengers.reduce((sum, { density }) => sum + parseInt(density), 0)/this.passengers.length
    });



  }

  getMobilemessage () {
    this._mobile.getalerts().subscribe((res) => {
      this.rowData = res
      
    })
  }
  
  getalerts () {
    this._alert.getalerts().subscribe( (res) => {
      this.alerts = res
    });
  }

  getPassenger () {
    this._passenger.getPassengers().subscribe( (res) => {
      this.passengers = res
    });

    this.average = this.passengers.reduce((sum, { density }) => sum + parseInt(density), 0)/this.passengers.length
  }

  getdata () {
    let time;
    let datasets;

    this._parking.getParking().subscribe(async (res: any) => {
       //console.log(res)
       let code = await res.map( res => res.code);
       let date = await res.map( res => res.date);
       time = await res.map( res => res.time)[0];
       let ncarrem = await res.map( res => res.ncarrem);
       //console.log('code, date, time, ncarrem',code, date[0],time[0],ncarrem)
       //data

       datasets = this.genDataset(time, code,ncarrem);
       console.log('time,datasets',time, datasets);
    });

  }
  genDataset(time: any, code: any, ncarrem: any): any {
    let datasets = []
    console.log('code,datasets,codelength', code,ncarrem, code.length  )

    let dataset = {
                    label: [],
                    borderColor: "#FF5733",
                    data: [],
                    fill: false,
                    pointStyle: 'circle',
                    backgroundColor: '#3498DB',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    lineTension: 0,
                }

    code.forEach((c,i) => {
      // console.log(i)
      // console.log('c,n', c, ncarrem[i])
      dataset.label.push(c)
      dataset.data.push(ncarrem[i])
      datasets.push(dataset)

    });

    this.chart = new Chart('canvas', {
       type: 'line',
       data: {
         labels: code,
         datasets: datasets
       },
       options: {
         legend: {
           display: false
         },
         scales: {
           xAxes: [{
             display: true
           }],
           yAxes: [{
             display: true
           }],
         }
       }
     });

    return datasets

  }

  onSubmit() {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    const data = this.alertForm.value;
    data.notify_date = now
   
    this._mobile.sendalerts(data).subscribe(res => {
      console.log(res);
      this._toastr.success("Successfull send alert" + res);
    })

    this._mobile.savealerts(data).subscribe(res => {
      console.log(res)
    })
    this.closeModal();
    return false;
  }
  private closeModal(): void {
    this.closeBtn.nativeElement.click();
 }

 onGridReady(params) {
  console.log(params)
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
  this.gridApi.sizeColumnsToFit()
  //const allColumnIds = [];
  // this.gridColumnApi.getAllColumns().forEach(function(column) {
  //   allColumnIds.push(column.colId);
  // });
  //this.gridColumnApi.autoSizeColumns(allColumnIds);
}

// ngValue returning index nd value
changeRoute(route) {
 
  console.log(this.allstations)
  console.log(route)
  const stationsObj  = this.allstations[route]
  this.stations = stationsObj.map( s => {
    return s.station
  })
}
}

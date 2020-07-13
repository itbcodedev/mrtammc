import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GtfsdbService } from '../../services/gtfsdb.service';
import { GtfsEditor } from "./gtfs.colume";
import { MasterColume } from "./master.colume"
import { ToastrService } from "ngx-toastr";

declare var $: any;
@Component({
  selector: 'app-mrtaline',
  templateUrl: './mrtaline.component.html',
  styleUrls: ['./mrtaline.component.scss']
})
export class MrtalineComponent implements OnInit, AfterViewInit {

  agencyForm: FormGroup;
  routesForm: FormGroup;
  tripsForm: FormGroup;
  stopsForm: FormGroup;
  stoptimesForm: FormGroup;
  calendarForm: FormGroup;
  calendardatesForm: FormGroup;
  fareattributesForm: FormGroup;
  farerulesForm: FormGroup;
  shapesForm: FormGroup;
  pathwaysForm: FormGroup;
  frequenciesForm: FormGroup;
  transfersForm: FormGroup;
  levelsForm: FormGroup;

  modal_title;
  modal_body;
  modal_icon;
  listview = false;
  columnDefs: any;
  rowData: any;
  model;

  // colume
  mastercolume
  wheelchair_boarding;
  route_type;
  agency_timezone;
  agency_lang;
  submitted = false;

  gridApi
  gridColumnApi
  defaultColDef

  constructor(private fb: FormBuilder,
    private _toastr: ToastrService,
    private _gtfsdb: GtfsdbService,
  ) {

    this.mastercolume = new MasterColume().MASTER_COLUMNDEFS
    this.wheelchair_boarding = this.mastercolume.wheelchair_boarding
    this.route_type = this.mastercolume.route_type
    this.agency_timezone = this.mastercolume.agency_timezone
    this.agency_lang = this.mastercolume.agency_lang

    this.agencyForm = this.fb.group({
      agency_key: ['', Validators.required],
      agency_id: ['', Validators.required],
      agency_name: ['', Validators.required],

      agency_url: ['', Validators.required],
      agency_timezone: ['', Validators.required],
      agency_lang: ['', Validators.required],

      agency_phone: ['', Validators.required],
      agency_fare_url: ['', Validators.required],
      agency_email: ['', Validators.required, Validators.email],

    });
    // convenience getter for easy access to form fields


    this.routesForm = this.fb.group({
      agency_key: ['', Validators.required],
      agency_id: ['', Validators.required],
      route_id: ['', Validators.required],


      route_short_name: ['', Validators.required],
      route_long_name: ['', Validators.required],
      route_desc: ['', Validators.required],

      route_type: ['', Validators.required],
      route_url: ['', Validators.required],
      route_color: ['', Validators.required],

      route_text_color: ['', Validators.required]
    });

    this.tripsForm = this.fb.group({
      agency_key: ['', Validators.required],
      route_id: ['', Validators.required],
      service_id: ['', Validators.required],

      trip_id: ['', Validators.required],
      trip_headsign: ['', Validators.required],
      trip_short_name: ['', Validators.required],

      direction_id: ['', Validators.required],
      block_id: ['', Validators.required],
      shape_id: ['', Validators.required],

      wheelchair_accessible: ['', Validators.required],
      bikes_allowed: ['', Validators.required]
    });

    this.stopsForm = this.fb.group({
      agency_key: ['', Validators.required],
      stop_id: ['', Validators.required],
      stop_code: ['', Validators.required],

      stop_name: ['', Validators.required],
      stop_desc: ['', Validators.required],
      stop_lat: ['', Validators.required],

      stop_lon: ['', Validators.required],
      zone_id: ['', Validators.required],
      stop_url: ['', Validators.required],

      location_type: ['', Validators.required],
      parent_station: ['', Validators.required],
      stop_timezone: ['', Validators.required],

      wheelchair_boarding: ['', Validators.required],
      level_id: ['', Validators.required],
      platform_code: ['', Validators.required]
    });

    this.stoptimesForm = this.fb.group({
      agency_key: ['', Validators.required],
      trip_id: ['', Validators.required],
      arrival_time: ['', Validators.required],

      departure_time: ['', Validators.required],
      stop_id: ['', Validators.required],
      stop_sequence: ['', Validators.required],

      stop_headsign: ['', Validators.required],
      pickup_type: ['', Validators.required],
      drop_off_type: ['', Validators.required],

      shape_dist_traveled: ['', Validators.required],
      timepoint: ['', Validators.required],
    });

    this.calendarForm = this.fb.group({
      agency_key: ['', Validators.required],
      service_id: ['', Validators.required],
      monday: ['', Validators.required],

      tuesday: ['', Validators.required],
      wednesday: ['', Validators.required],
      thursday: ['', Validators.required],

      friday: ['', Validators.required],
      saturday: ['', Validators.required],
      sunday: ['', Validators.required],

      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });

    this.calendardatesForm = this.fb.group({
      agency_key: ['', Validators.required],
      service_id: ['', Validators.required],
      date: ['', Validators.required],
      exception_type: ['', Validators.required]
    });


    this.fareattributesForm = this.fb.group({
      agency_key: ['', Validators.required],
      agency_id: ['', Validators.required],
      fare_id: ['', Validators.required],

      price: ['', Validators.required],
      currency_type: ['', Validators.required],
      payment_method: ['', Validators.required],

      transfers: ['', Validators.required],
      transfer_duration: ['', Validators.required]
    });

    this.farerulesForm = this.fb.group({
      agency_key: ['', Validators.required],
      fare_id: ['', Validators.required],
      route_id: ['', Validators.required],

      origin_id: ['', Validators.required],
      destination_id: ['', Validators.required],
      contains_id: ['', Validators.required]
    });

    this.shapesForm = this.fb.group({
      agency_key: ['', Validators.required],
      shape_id: ['', Validators.required],
      shape_pt_lat: ['', Validators.required],

      shape_pt_lon: ['', Validators.required],
      shape_pt_sequence: ['', Validators.required],
      shape_dist_traveled: ['', Validators.required]
    });

    this.pathwaysForm = this.fb.group({
      agency_key: ['', Validators.required],
      pathway_id: ['', Validators.required],
      from_stop_id: ['', Validators.required],

      to_stop_id: ['', Validators.required],
      pathway_mode: ['', Validators.required],
      is_bidirectional: ['', Validators.required]
    });

    this.frequenciesForm = this.fb.group({
      agency_key: ['', Validators.required],
      trip_id: ['', Validators.required],
      start_time: ['', Validators.required],

      end_time: ['', Validators.required],
      headway_secs: ['', Validators.required],
      exact_times: ['', Validators.required]
    });

    this.transfersForm = this.fb.group({
      agency_key: ['', Validators.required],
      from_stop_id: ['', Validators.required],
      to_stop_id: ['', Validators.required],

      transfer_type: ['', Validators.required],
      min_transfer_time: ['', Validators.required]
    });

    this.levelsForm = this.fb.group({
      agency_key: ['', Validators.required],
      level_id: ['', Validators.required],
      level_index: ['', Validators.required],

      level_name: ['', Validators.required]
    });

    this.defaultColDef = { resizable: true };
  }

  ngOnInit() {

  }

  // convenience getter for easy access to form fields
  get af() { return this.agencyForm.controls; }
  get rf() { return this.routesForm.controls; }
  get tf() { return this.tripsForm.controls; }
  get sf() { return this.stopsForm.controls; }
  get stf() { return this.stoptimesForm.controls; }
  get cf() { return this.calendarForm.controls; }
  get cdf() { return this.calendardatesForm.controls; }
  get faf() { return this.fareattributesForm.controls; }
  get frf() { return this.farerulesForm.controls; }
  get shf() { return this.shapesForm.controls; }
  get pwf() { return this.pathwaysForm.controls; }
  get ff() { return this.frequenciesForm.controls; }
  get trf() { return this.transfersForm.controls; }
  get lf() { return this.levelsForm.controls; }

  ngAfterViewInit(): void {
    $('#treemenu').on("select_node.jstree", function(e, data) {
      var href = data.node.a_attr.href;
      if (href[0] == "#") {
        // document.location.href = href;

        $('#agencys_info').hide();
        $('#routes_info').hide();
        $('#trips_info').hide();
        $('#stops_info').hide();
        $('#stop_times_info').hide();
        $('#calendars_info').hide();
        $('#calendar_dates_info').hide();
        $('#fare_attributes_info').hide();
        $('#fare_rules_info').hide();
        $('#shapes_info').hide();
        $('#pathways_info').hide();
        $('#frequencies_info').hide();
        $('#transforms_info').hide();
        $('#levels_info').hide();
        // $('#listview').hide();
        $(`${href}`).toggle();
        $('#gtfstab')[0].click();
        $('#hidelistview')[0].click();
      }
    }).jstree();
  }

  hidelistview() {
    console.log('hidlistview')
    this.listview = false
  }

  // autosave
  onCellValueChanged(model: any, params: any) {
    this.rowData[params.rowIndex] = params.data
    const obj = this.rowData
    const result = []
    this._gtfsdb.liveupdate(model, obj).subscribe((data: any) => {
      const result = data;
      console.log(result);
      this._toastr.success("Live Update", "แก้ไขสำเร็จ...", { timeOut: 2000 });
    },
      error => {
        console.log(error)
        this._toastr.error("Live Update", "ผิดพลาด...", { timeOut: 2000 })
      });
  }
  // Agency

  viewAgency() {

    this.model = 'Agency'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['agency'];
    console.log(this.columnDefs)
    this._gtfsdb.getAgencies().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onAgencySubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add agency", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addAgency(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
    })
  }



  deleteAgency(id: any) {

  }

  editAgency(id: any) {

  }
  // Route
  viewRoute() {
    this.model = 'Route'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['routes'];
    this._gtfsdb.getRoutes().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onRouteSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Route", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addRoute(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
    })
  }

  // Trip
  viewTrip() {
    this.model = 'Trip'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['trips'];
    this._gtfsdb.getTrips().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onTripSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Trip", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addTrip(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
    })
  }

  // Stop
  viewStop() {
    this.model = 'Stop'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['stops'];
    console.log(this.columnDefs)
    this._gtfsdb.getStops().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onStopSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Stop", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addStop(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Stoptime
  viewStoptime() {

    this.model = 'StopTime'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['stop_times'];
    this._gtfsdb.getStoptimes().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onStoptimeSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Stoptime", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }

    const data = form.value
    this._gtfsdb.addStoptime(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Calendar
  viewCalendar() {
    this.model = 'Calendar'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['calendars'];
    this._gtfsdb.getCalendars().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onCalendarSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Calendar", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }

    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Calendar", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addCalendar(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Calendar Date
  viewCalendardate() {
    this.model = 'CalendarDate'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['calendar_dates'];
    this._gtfsdb.getCalendardates().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onCalendardateSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Calendardate", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addCalendardates(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // fare attributes
  viewFareattribute() {

    this.model = 'FareAttribute'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['fare_attributes'];
    this._gtfsdb.getFareattributes().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })

  }

  onFareattributeSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Fareattribute", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }

    const data = form.value
    this._gtfsdb.addFareattribute(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Fare rule
  viewFarerule() {
    this.model = 'FareRule'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['fare_rules'];
    this._gtfsdb.getFarerules().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onFareRuleSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add FareRule", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addFarerule(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Shape
  viewShape() {
    this.model = 'Shape'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['shapes'];
    this._gtfsdb.getShapes().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onShapeSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Shape", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }

    const data = form.value
    this._gtfsdb.addShape(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Path Way
  viewPathway() {
    this.model = 'Pathway'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['pathways'];
    this._gtfsdb.getPathways().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onPathwaySubmit(form: any) {

    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Pathway", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }


    const data = form.value
    this._gtfsdb.addPathway(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Frequency
  viewFrequency() {
    this.model = 'Frequency'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['frequencies'];
    this._gtfsdb.getFrequencies().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }


  onFrequencySubmit(form: any) {

  this.submitted = true;
  // stop here if form is invalid
  if (form.invalid) {
    this._toastr.error("Add Frequency", "ผิดพลาด...", { timeOut: 2000 });
    return;
  }


    const data = form.value
    this._gtfsdb.addFrequency(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Transfer
  viewTransfer() {
    this.model = 'Transfer'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['transfers'];
    this._gtfsdb.getTransfers().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }

  onTransferSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Transfer", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addTransfer(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }

  // Level
  viewLevel() {
    console.log('level');
    this.model = 'Level'
    this.listview = !this.listview
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS['levels'];
    this._gtfsdb.getLevels().subscribe(res => {
      this.rowData = res;
      console.log(res)
    })
  }
  onLevelSubmit(form: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this._toastr.error("Add Level", "ผิดพลาด...", { timeOut: 2000 });
      return;
    }
    const data = form.value
    this._gtfsdb.addLevel(data).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err);
      this._toastr.error("Error Submit", err, { timeOut: 2000 })
    })
  }
  onGridReady(params) {
    //console.log(params)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;   
    params.api.sizeColumnsToFit(); 
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
}

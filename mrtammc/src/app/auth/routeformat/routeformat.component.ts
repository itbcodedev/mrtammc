import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GtfsService } from '../../services/gtfs2.service'
import { ToastrService } from 'ngx-toastr';

import { RouteformatService } from '../../services/routeformat.service'

import { ImageFormatterComponent } from '../../image-formatter/image-formatter.component'

import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';


declare let L;
import * as $ from 'jquery';

@Component({
  selector: 'app-routeformat',
  templateUrl: './routeformat.component.html',
  styleUrls: ['./routeformat.component.scss']
})
export class RouteformatComponent implements OnInit {



  @ViewChild("map", { static: true })
  public mapElement: ElementRef

  @ViewChild("mapdiv", { static: true })
  public mapDiv: ElementRef;

  routeformatForm: FormGroup;

  map
  height
  latitude
  longitude
  controllerLayer
  baseLayers
  defaultColDef
  columnDefs
  rowData

  route
  // gridApi and columnApi
  private api: GridApi;
  private columnApi: ColumnApi;
  private userToBeEditedFromParent: any;

  routes
  allstations
  stations
  station
  stationonlines = []

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private _gtfsservice: GtfsService,
    private _routeformatservice: RouteformatService
  ) {
    this.routeformatForm = this.fb.group({
      route: ['', Validators.required],
      color: ['', Validators.required],
      station_icon: ['', Validators.required],
      train_icon: ['', Validators.required]
    })

    this.height = 775 + "px";
  }

  ngOnInit() {
    const latLon = L.latLng(13.788593154063312, 100.44842125132114);
    this.map = L.map(this.mapElement.nativeElement).setView(latLon, 12);

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
    });

    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    this.baseLayers = {
      'OSM Map': osmMap,
      'Light Map': lightMap,
      'googleStreets': googleStreets,
      'googleHybrid': googleHybrid,
      'googleSat': googleSat,
      'googleTerrain': googleTerrain
    };


    this.controllerLayer = L.control.layers(this.baseLayers);
    this.controllerLayer.addTo(this.map);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    this._gtfsservice.getallstations().then(obj => {
      this.allstations = obj
      console.log(this.allstations)
      this.routes = Object.keys(obj)
      console.log(this.routes)
    })


    this.columnDefs = this.createColumnDefs();

    this._routeformatservice.getrouteformat().subscribe(result => {
      this.rowData = result
    }, (error) => {
      console.log(error)
    })

  } //ngOnInit()

  // one grid initialisation, grap the APIs and auto resize the columns to fit the available space
  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

  // create culume definitions
  private createColumnDefs() {
    return [
      { headerName: 'Route', field: 'route', editable: true },
      { headerName: 'Color', field: 'color', editable: true },
      { headerName: 'Station icon', field: 'station_icon', editable: true, autoHeight: true, cellRendererFramework: ImageFormatterComponent },
      { headerName: 'Train icon', field: 'train_icon', editable: true, autoHeight: true, cellRendererFramework: ImageFormatterComponent }
    ]
  }

  // chage station icon
  onFileChange_station(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file)
      this.routeformatForm.get('station_icon').setValue(file);
    }

  }

  // change train icon
  onFileChange_train(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file)
      this.routeformatForm.get('train_icon').setValue(file);
    }

  }

  // submit data
  submitRouteFormatData() {
    const formData: any = new FormData();

    formData.append('route', this.routeformatForm.get('route').value)
    formData.append('color', this.routeformatForm.get('color').value)
    formData.append('station_icon', this.routeformatForm.get('station_icon').value)
    formData.append('train_icon', this.routeformatForm.get('train_icon').value)

    // post Formdata
    this._routeformatservice.saverouteformat(formData).subscribe(res => {
      console.log(res)
      this.toastr.success('ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว', 'Success', {
        timeOut: 3000
      });
    });

    this.update()
  }

  // dynamic render selection box
  changeRoute(e) {
    //console.log(e)
    //console.log(this.allstations[`${e}`])
    this.stationonlines  = this.allstations[`${e}`]
  }

  // refresh data  when select tab
  refresh() {
    this._routeformatservice.getrouteformat().subscribe(result => {
      this.rowData = result
    }, (error) => {
      console.log(error)
    })
  }

  //Get all rows
  getRowData() {
    var rowData = [];
    this.api.forEachNode(function (node) {
      rowData.push(node.data);
    });
    console.log("Row Data:");
    console.log(rowData);
  }

  // delete record from action menu
  deleteRouteFormat() {
    var selectedRows = this.api.getSelectedRows();

    console.log(selectedRows)
    if (selectedRows.length == 0) {
      this.toastr.error('กรุณาเลือก ข้อมูลที่ต้องการลบ', 'Error', {
        timeOut: 3000
      });
      return;
    }
    // remove from database

    // refresh
    //this.ngOnInit();
    this.api.refreshRows(null);

    var res = this.api.updateRowData({ remove: selectedRows });
    console.log(res.remove[0].data);
    var id = res.remove[0].data._id;

    this._routeformatservice.deleterouteformat(id)

    this.toastr.success('ได้ลบข้อมูลที่ ท่านได้เลือกแล้ว', 'Success', {
      timeOut: 3000
    });


  }


  //Get click
  onSelectionChanged(event) {
    var selectedRows = this.api.getSelectedRows();
    this.userToBeEditedFromParent = selectedRows;
    console.log(this.userToBeEditedFromParent);

    var selectedRowsString = "";
    selectedRows.forEach(function (selectedRow, index) {
      if (index > 5) {
        return;
      }
      if (index !== 0) {
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.id;
    });
    if (selectedRows.length >= 5) {
      selectedRowsString += " - and " + (selectedRows.length - 5) + " others";
    }
  }

  //Get edited row
  newData = [];
  
  onCellEditingStopped(e) {
    console.log(e.data);
    this._routeformatservice.updaterouteformat(e.data).subscribe(result => {
      console.log(result);
      this.toastr.success(JSON.stringify(result))
    }, (error) => {
      console.log(error);
      this.toastr.error(JSON.stringify(error))
    });
  }

  //Get updated row  
  onrowValueChanged(row) {
    console.log("onrowValueChanged: ");
    console.log("onrowValueChanged: " + row);
  }


  update() {
    this.refresh();
    this.ngOnInit();
 } 
}

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GtfsService } from '../../services/gtfs2.service';
import { ToastrService, ToastrComponentlessModule } from 'ngx-toastr';

import { KmltorouteService } from '../../services/kmltoroute.service';
import { ImageFormatterComponent } from '../../image-formatter/image-formatter.component';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';

declare let L;
import * as $ from 'jquery';

@Component({
  selector: 'app-kmltoroute',
  templateUrl: './kmltoroute.component.html',
  styleUrls: ['./kmltoroute.component.scss'],
})
export class KmltorouteComponent implements OnInit {
  @ViewChild('map', { static: true })
  public mapElement: ElementRef;

  @ViewChild('mapdiv', { static: true })
  public mapDiv: ElementRef;

  kmltorouteForm: FormGroup;
  height;
  map;
  baseLayers;
  controllerLayer;
  allstations = [];
  routes;

  columnDefs;
  rowData;

  stations;
  station;
  stationonlines = [];

  kmlroutes;

  // gridApi and columnApi
  private api: GridApi;
  private columnApi: ColumnApi;
  private userToBeEditedFromParent: any;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private _gtfsservice: GtfsService,
    private _kmltorouteservice: KmltorouteService
  ) {
    this.kmltorouteForm = this.fb.group({
      route_th: ['', Validators.required],
      route_en: ['', Validators.required],
      color: [''],
      kml_file: ['', Validators.required],
      route_id: ['']
    });

    this.height = 775 + 'px';
  }

  ngOnInit() {
    const latLon = L.latLng(13.788593154063312, 100.44842125132114);
    this.map = L.map(this.mapElement.nativeElement).setView(latLon, 12);

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

    this.baseLayers = {
      'OSM Map': osmMap,
      'Light Map': lightMap,
      googleStreets: googleStreets,
      googleHybrid: googleHybrid,
      googleSat: googleSat,
      googleTerrain: googleTerrain,
    };

    this.controllerLayer = L.control.layers(this.baseLayers);
    this.controllerLayer.addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this._gtfsservice.getallstations().then((obj) => {
      this.allstations = obj;
      //console.log(this.allstations)
      this.routes = Object.keys(obj);
      //console.log(this.routes)
    });

    this.columnDefs = this.createColumnDefs();

    this._kmltorouteservice.getkmltoroute().subscribe(
      (result) => {
        this.rowData = result;
      },
      (error) => {
        console.log(error);
      }
    );

    this.getKmltoroute();
  }

  async getKmltoroute() {
    this.kmlroutes = await this._kmltorouteservice.getkmltoroute().toPromise();
    this.kmlroutes.forEach((obj) => {
      console.log('138', obj.geojsonline_file);
      const line = new L.GeoJSON.AJAX(obj.geojsonline_file, {
        style: function (feature) {
          return { color: obj.color };
        },
      });

      line.addTo(this.map);
    });
  }

  // create culume definitions
  private createColumnDefs() {
    return [
      { headerName: 'ชื่อไทย', field: 'route_th', editable: true },
      { headerName: 'ชื่ออังกฤษ', field: 'route_en', editable: true },
      { headerName: 'route_id', field: 'route_id', editable: true },
      { headerName: 'Color', field: 'color', editable: true },
      { headerName: 'KML File', field: 'kml_file', editable: true },
      {
        headerName: 'Geojson Line File',
        field: 'geojsonline_file',
        editable: true,
      },
      {
        headerName: 'Geojson Point File',
        field: 'geojsonpoint_file',
        editable: true,
      },
    ];
  }

  //change route
  changeRoute(e) {
    //console.log(this.allstations[`${e}`])
    this.stationonlines = this.allstations[`${e}`];
  }

  // chage station icon
  onFileChange_kml(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.kmltorouteForm.get('kml_file').setValue(file);
    }
  }

  // submit data
  submitKmltoRouteFormatData() {
    console.log('208', this.kmltorouteForm.get('kml_file').value.name);
    const route_th = this.kmltorouteForm.get('route_th').value;
    const route_en = this.kmltorouteForm.get('route_en').value;
    const color = this.kmltorouteForm.get('color').value;
    const kml_file = this.kmltorouteForm.get('kml_file').value;
    const route_id = this.kmltorouteForm.get('route_id').value
    const formData: any = new FormData();

    formData.append('route_th', route_th);
    formData.append('route_en', route_en);
    formData.append('color', color);
    formData.append('kml_file', kml_file);
    formData.append('route_id', route_id);

    // post Formdata to backend
    this._kmltorouteservice.savekmltoroute(formData).subscribe((res) => {
      console.log(res);
      this.toastr.success('ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว', 'Success', {
        timeOut: 3000,
      });
    });

    this.update();
  }

  // refresh data  when select tab
  refresh() {
    this._kmltorouteservice.getkmltoroute().subscribe(
      (result) => {
        this.rowData = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  update() {
    this.refresh();
    this.getKmltoroute();
    this.ngOnInit();
  }

  // one grid initialisation, grap the APIs and auto resize the columns to fit the available space
  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

  // delete record from action menu
  deleteKmltoRouteFormat() {
    var selectedRows = this.api.getSelectedRows();

    console.log(selectedRows);
    if (selectedRows.length == 0) {
      this.toastr.error('กรุณาเลือก ข้อมูลที่ต้องการลบ', 'Error', {
        timeOut: 3000,
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

    this._kmltorouteservice.deletekmltoroute(id);

    this.toastr.success('ได้ลบข้อมูลที่ ท่านได้เลือกแล้ว', 'Success', {
      timeOut: 3000,
    });
  }

  //Get click
  onSelectionChanged(event) {
    var selectedRows = this.api.getSelectedRows();
    this.userToBeEditedFromParent = selectedRows;
    console.log(this.userToBeEditedFromParent);

    var selectedRowsString = '';
    selectedRows.forEach(function (selectedRow, index) {
      if (index > 5) {
        return;
      }
      if (index !== 0) {
        selectedRowsString += ', ';
      }
      selectedRowsString += selectedRow.id;
    });
    if (selectedRows.length >= 5) {
      selectedRowsString += ' - and ' + (selectedRows.length - 5) + ' others';
    }
  }

  //Get edited row
  newData = [];

  onCellEditingStopped(e) {
    console.log(e.data);
    this._kmltorouteservice.updatekmltoroute(e.data).subscribe(
      (result) => {
        console.log(result);
        this.toastr.success(JSON.stringify(result));
      },
      (error) => {
        console.log(error);
        this.toastr.error(JSON.stringify(error));
      }
    );
  }

  //Get updated row
  onrowValueChanged(row) {
    console.log('onrowValueChanged: ');
    console.log('onrowValueChanged: ' + row);
  }
}

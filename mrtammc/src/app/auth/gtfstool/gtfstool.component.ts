import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GtfsService } from '../../services/gtfs2.service'
import { ToastrService } from 'ngx-toastr';

import { KmlfileserviceService } from '../../services/kmlfileservice.service'

@Component({
  selector: 'app-gtfstool',
  templateUrl: './gtfstool.component.html',
  styleUrls: ['./gtfstool.component.scss']
})
export class GtfstoolComponent implements OnInit {

  gtfsToolForm: FormGroup;
  allstations
  routes
  allkmlfiles

  rowData
  columnDefs

  api
  columnApi
  newData

  constructor(
    private fb: FormBuilder,
    private _kmlfileservice: KmlfileserviceService,
    private toastr: ToastrService,
    private _gtfsservice: GtfsService,
  ) {
    this.gtfsToolForm = this.fb.group({
      route: ['', Validators.required],
      kml_file: ['', Validators.required]
    })
  }

  ngOnInit() {
    this._gtfsservice.getallstations().then(obj => {
      this.allstations = obj
      console.log(this.allstations)
      this.routes = Object.keys(obj)
      console.log(this.routes)
    })

    this.columnDefs = this.createColumnDefs();

    this._kmlfileservice.getkmltool().subscribe(result => {
      this.rowData = result
    }, (error) => {
      console.log(error)
    })
  }

  // create culume definitions
  private createColumnDefs() {
    return [
      { headerName: 'Route', field: 'route' },
      { headerName: 'kml_path', field: 'kml_path' },
      { headerName: 'geojson_path', field: 'geojson_path' },
      { headerName: 'shapefile_path', field: 'shapefile_path' }
    ]
  }

  changeRoute(e) {

  }

  // refresh data  when select tab
  refresh() {

  }

  onCellEditingStopped(e) {
    //console.log(e.data);
    this.api.forEachNode(node => {
      if (!node.data.id)
        this.newData.push(node.data)
    });
    console.log("On editing stopped");
    console.log(this.newData);
  }

  //Get updated row  
  onrowValueChanged(row) {
    console.log("onrowValueChanged: ");
    console.log("onrowValueChanged: " + row);
  }

  onFileChange_KML(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file)
      this.gtfsToolForm.get('kml_file').setValue(file);
    }

  }

  submitgtfsFormatData() {
    const formData: any = new FormData();
    formData.append('route', this.gtfsToolForm.get('route').value)
    formData.append('kml_file', this.gtfsToolForm.get('kml_file').value)

    // post Formdata
    this._kmlfileservice.savekmlfile(formData).subscribe(res => {
      console.log(res)
    });
  }

  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

  // delete record from action menu
  deletekmltool() {
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

    this._kmlfileservice.deletekmltool(id)

    this.toastr.success('ได้ลบข้อมูลที่ ท่านได้เลือกแล้ว', 'Success', {
      timeOut: 3000
    });


  }

  //Get updated row
  onSelectionChanged(event) {
    var selectedRows = this.api.getSelectedRows();
    // this.userToBeEditedFromParent = selectedRows;
    // console.log(this.userToBeEditedFromParent);

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

}

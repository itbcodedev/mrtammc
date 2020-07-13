import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
import { GtfsService } from '../../services/gtfs2.service'
import { ToastrService, ToastrComponentlessModule } from 'ngx-toastr';
import { RatioparkingService } from '../../services/ratioparking.service'

// ag-grid
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';


@Component({
  selector: 'app-ratioparking',
  templateUrl: './ratioparking.component.html',
  styleUrls: ['./ratioparking.component.scss']
})
export class RatioparkingComponent implements OnInit {

  api
  columnApi

  columnDefs
  rowData
  userToBeEditedFromParent

  levels: string[] = ['level1', 'level2', 'level3', 'level4', 'level5'];
  colors: string[] = ['light-green', 'greee', 'yellow', 'orange', 'red'];
  height

  ratioparkingForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private _gtfsservice: GtfsService,
    private _ratioparkingservice: RatioparkingService) {

    this.ratioparkingForm = this.fb.group({
      level: ['', Validators.required],
      color: ['', Validators.required],
      percent: ['', Validators.required]
    })

    this.height = 775 + "px";
  }

  ngOnInit() {

    this.columnDefs = this.createColumnDefs();

    this._ratioparkingservice.getratioparking().subscribe(result => {
      console.log("48",result)
      this.rowData = result
    }, (error) => {
      console.log(error)
    })
  }

  // submit data
  submitRatioParkingData() {

    console.log(this.ratioparkingForm.value)
    this._ratioparkingservice.saveratioparking(this.ratioparkingForm.value).subscribe(res => {
      console.log(res)
      this.toastr.success('ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว', 'Success', {
        timeOut: 3000
      });
    });

    this.update()
  }

  // refresh data  when select tab
  refresh() {
    this._ratioparkingservice.getratioparking().subscribe(result => {
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


  // one grid initialisation, grap the APIs and auto resize the columns to fit the available space
  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

  // create culume definitions
  private createColumnDefs() {
    return [
      { headerName: 'Level', field: 'level', editable: true },
      { headerName: 'Color', field: 'color', editable: true },
      { headerName: 'Percent', field: 'percent', editable: true }
    ]
  }

  // delete record from action menu
  deleteRatioparking() {
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

    this._ratioparkingservice.deleteratioparking(id)

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
    this._ratioparkingservice.updateratioparking(e.data).subscribe(result => {
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

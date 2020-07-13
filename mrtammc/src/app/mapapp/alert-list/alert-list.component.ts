import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service'

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit {

  columnDefs = [
    { headerName: 'type', field: 'type' },
    { headerName: 'source', field: 'source' },
    { headerName: 'ipaddr', field: 'ipaddr' },
    { headerName: 'message', field: 'message' },
    { headerName: 'level', field: 'level' },
    { headerName: 'creation_dt', field: 'creation_dt' },
  ];

  rowData;

  constructor(private _alertservice: AlertService) { }

  ngOnInit() {
    this.getAlerts()
  }

  getAlerts() {
    this._alertservice.getalerts()
      .subscribe(
        data => {
          console.log(data);
          this.rowData = data;
        }
      )
  }
}



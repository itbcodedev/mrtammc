import { Component, OnInit } from '@angular/core';
import { ParkingserviceService} from '../../services/parkingservice.service';
import { AlertService} from '../../services/alert.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { Alert} from '../../models/alert.model'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  totoalncarrem = 0;
  totalcapacity = 0;
  parkinglocations ;
  parkings;
  alerts;
  alert;
  constructor(
    public _parking: ParkingserviceService,
    private _alertservice: AlertService) { }

  ngOnInit() {
    // this.getParking();
    // this.getAlert();
  }

  getParking() {
    let get_parking = this._parking.getParking();
    let get_location = this._parking.getParkinglocation();
    forkJoin([get_parking, get_location]).subscribe(result=>{
      this.parkinglocations = result[1];
      this.parkings = result[0];

      //console.log(this.parkings);
      this.parkings.forEach(parking => {
        this.totoalncarrem += +parking.ncarrem

        this.parkinglocations.forEach(pl => {
          if (parking.code == pl.code) {
            this.totalcapacity += pl.capacity
          }
        });
      });

      this._parking.totoalncarrem = this.totoalncarrem;
      this._parking.totalcapacity = this.totalcapacity;


    });
  }

  getAlert() {
    this._alertservice.getalerts()
      .subscribe(
        (data: Alert[]) => {
          if (data.length == 0) {
            this.alerts = 0;
            this.alert = {};
          } else {
            this.alerts = data.length;
            this.alert = data.slice(-1)[0];
          }

        }
      )
  }
}

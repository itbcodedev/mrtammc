import { Injectable, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingserviceService {
  baseUrl = environment.baseUrl;
  parkingjson = 'assets/masterdb/parking.json'
  totoalncarrem: number;
  totalcapacity: number
  constructor(private _http: HttpClient,
              @Inject(DOCUMENT) private document) { }

  getParking() {
    //const parkingurl = `http://${this.document.location.hostname}:3000/parking/all`
    let url = this.baseUrl + '/parking/all'

    return this._http.get(url, {
      observe: 'body',
    });
  }

  getParkinglocation() {
    return this._http.get(this.parkingjson);
  }
}

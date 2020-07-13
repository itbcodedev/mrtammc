import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  AddParking(data) {
    const url = this.baseUrl + '/api/v2/parkings/create'
    return this._http.post(url, data)
  }

  getParking() {
    const url = this.baseUrl + '/api/v2/parkings'
    return this._http.get(url)
  }

  deleteParking(id: any) {
    let url = this.baseUrl + '/api/v2/parkings/' + id
    return this._http.delete(url)
  }

  updateParking(data: any) {
    console.log("40",data)
    let url = this.baseUrl + '/api/v2/parkings/' + data._id

    return this._http.put(url, data)
  }
}

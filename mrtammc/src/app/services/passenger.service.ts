import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  getPassengers() {
    let url = this.baseUrl + '/api/v2/passengers'
    return this._http.get(url)
  }
}

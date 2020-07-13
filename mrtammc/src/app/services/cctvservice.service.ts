import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CctvserviceService {
  cctvjson = 'assets/masterdb/cctv.json'
  constructor(private _http: HttpClient) {

  }
  getCctvlocation() {
    return this._http.get(this.cctvjson);
  }
}

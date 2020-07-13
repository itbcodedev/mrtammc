import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CctvService {

  baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  AddCctv(data) {
    const url = this.baseUrl + '/api/v2/cctvs/create'
    return this._http.post(url, data)
  }

  getCctv() {
    const url = this.baseUrl + '/api/v2/cctvs'
    return this._http.get(url)
  }

  getserverstatus() {
    const url = this.baseUrl + '/api/v2/cctvs/server/status'
    return this._http.get(url)
  }

  restartserver() {
    const url = this.baseUrl + '/api/v2/cctvs/server/restart'
    return this._http.get(url)
  }

  deletecctv(id: any) {
    let url = this.baseUrl + '/api/v2/cctvs/' + id
    return this._http.delete(url)
  }

  updatecctv(data: any) {
    console.log("40",data)
    let url = this.baseUrl + '/api/v2/cctvs/' + data._id

    return this._http.put(url, data)
  }
}

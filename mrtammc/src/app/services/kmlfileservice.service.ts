import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class KmlfileserviceService {

  baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  savekmlfile(formData: any) {
    console.log(formData)
    let url = this.baseUrl + '/api/v2/kmltool/genshapesfile'
    return this._http.post(url, formData)

  }

  getkmltool() {
    let url = this.baseUrl + '/api/v2/kmltool'
    return this._http.get(url)
  }

  deletekmltool(id) {
    let url = this.baseUrl + '/api/v2/kmltool/' + id
    this._http.delete<any>(url).subscribe(
      res => {
        console.log(res);
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log("Client-side error occurred.");
      } else {
        console.log("Server-side error occurred.");
      }
    });
  }
}

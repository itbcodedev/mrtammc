import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RatioparkingService {

  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  saveratioparking(formData: any) {

    let url = this.baseUrl + '/api/v2/ratioparking/create'
    return this._http.post(url, formData)
  }

  getratioparking() {
    let url = this.baseUrl + '/api/v2/ratioparking'
    return this._http.get(url)
  }

  deleteratioparking(id: any) {
    let url = this.baseUrl + '/api/v2/ratioparking/' + id
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

  updateratioparking(data: any) {
    console.log("40",data)
    let url = this.baseUrl + '/api/v2/ratioparking/' + data._id

    return this._http.put(url, data)
  } 
}

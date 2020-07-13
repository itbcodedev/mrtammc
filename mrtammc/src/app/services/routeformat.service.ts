import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RouteformatService {

  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  saverouteformat(formData: any) {
    let url = this.baseUrl + '/api/v2/routeformat/create'
    return this._http.post(url, formData)
  }

  getrouteformat() {
    let url = this.baseUrl + '/api/v2/routeformat'
    return this._http.get(url)
  }

  deleterouteformat(id: any) {
    let url = this.baseUrl + '/api/v2/routeformat/' + id
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

  updaterouteformat(data: any) {
    console.log("40",data)
    let url = this.baseUrl + '/api/v2/routeformat/' + data._id

    return this._http.put(url, data)
  }
}




import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KmltorouteService {

  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  savekmltoroute(formData: any) {
    
    let url = this.baseUrl + '/api/v2/kmltoroute/create'
    console.log(14, '/api/v2/kmltoroute/create', url , formData )
    return this._http.post(url, formData)
  }

  getkmltoroute() {
    let url = this.baseUrl + '/api/v2/kmltoroute'
    return this._http.get(url)
  }

  deletekmltoroute(id: any) {
    let url = this.baseUrl + '/api/v2/kmltoroute/' + id
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
  updatekmltoroute(data: any) {
    console.log("40",data)
    let url = this.baseUrl + '/api/v2/kmltoroute/' + data._id

    return this._http.put(url, data)
  }
}

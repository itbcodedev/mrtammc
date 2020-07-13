import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  getalerts() {
    let url = this.baseUrl + '/api/v2/alerts'
    return this._http.get(url)
  }
}

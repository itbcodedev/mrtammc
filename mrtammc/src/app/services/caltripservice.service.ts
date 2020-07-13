import { Injectable, Inject  } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class CaltripserviceService {
  linejson = 'assets/masterdb/lines.json'

  constructor(private _http: HttpClient,
              @Inject(DOCUMENT) private document) { }

  gettrip() {
    return this._http.get(this.linejson);
  }

  getfairtable(config) {
    let params = new HttpParams()
          .set('TypeTk', config.TypeTk)
          .set('TypePs', config.TypePs)
          .set('TypeDt', config.TypeDt)
          .set('AccessKey',config.AccessKey)

    const fareurl = `http://${this.document.location.hostname}:3000/fare/search`
    //request  http://localhost:3000/fare/all?TypeTk=C&TypePs=N&TypeDt=N
    return this._http.get(fareurl, {params});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadfileService {
  baseUrl = environment.baseUrl;
  upload_url = `${this.baseUrl}/upload`
  // upload_url = 'http://localhost:3000/upload';

  constructor(private _http: HttpClient) {

  }

  onVerify(formData : FormData) {
    console.log(this.upload_url);
    return this._http.post(this.upload_url, formData, {
       reportProgress: true,
       observe: 'events'
    });
  }

}

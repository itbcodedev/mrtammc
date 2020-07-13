import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigfileService {

  baseUrl = environment.baseUrl;
  listfile_url = `${this.baseUrl}/listdir`;
  upload_url = `${this.baseUrl}/configfile`;

  constructor(private _http: HttpClient) {

  }

  onVerify(formData: FormData, filename: string) {
    return this._http.post(this.upload_url+ "/" + filename , formData, {
       reportProgress: true,
       observe: 'events'
    });
  }

  getconfigfile(filename: string) {
    console.log(filename);
    return this._http.get(this.upload_url +'/view/' + filename);
  }

  deleteconfigfile(filename: string) {
    console.log('delete config file ->' + filename);
    return this._http.get(this.upload_url +'/delete/' + filename);
  }

  savedbconfigfile(filename: string) {
    console.log('save to database  ->' + filename);
    return this._http.get(this.upload_url +'/savedb/' + filename);
  }

  deployconfigfile(filename: string) {
    console.log('deploy config file ->' + filename);
    return this._http.get(this.upload_url +'/deployconfig/' + filename);
  }

  listdir() {
    return this._http.get(this.listfile_url + '/configfiles');
  }

  liveupdate(file:any, data: any): any {
    return this._http.post(this.upload_url + '/liveupdate/' + file, data);
  }

  uploadkml(formData: any) {
    const kmlurl =  `${this.baseUrl}/kml`
    return this._http.post(kmlurl, formData)

  }
  getkml() {
    const kmlurl =  `${this.baseUrl}/kml`
    return this._http.get(kmlurl)

  }

  deletekml(id: any) {
       const kmlurl =  `${this.baseUrl}/kml/${id}`
       return this._http.delete(kmlurl)
  }

  editkml(id: any) {

  }

  getkmlbyid(id: any) {
    const kmlurl =  `${this.baseUrl}/kml/${id}`
    return this._http.get(kmlurl)
  }

  updatekml(id: any, data) {
    const kmlurl =  `${this.baseUrl}/kml/${id}`
    return this._http.put(kmlurl,data);
  }

}

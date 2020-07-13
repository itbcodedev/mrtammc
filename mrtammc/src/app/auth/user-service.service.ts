import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from './user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  baseUrl = environment.baseUrl;

  formdata: User;

  constructor(private _http: HttpClient) {
    this.formdata = new User();
  }

  submitRegister(body: any) {
    // submit data to api
    let url = this.baseUrl + '/users/register'
    return this._http.post(url, body, {
      observe: 'response'
    });
  }

  updateUser(body: any) {
    // submit data to api
    let url = this.baseUrl + '/users/update'
    return this._http.post(url, body, {
      observe: 'response'
    });
  }

  login(body: any) {
    //let url = this.baseUrl + '/users/login'
    // use ldap authentication method
    let url = this.baseUrl + '/ldap'
    return this._http.post(url, body, { observe: 'response' });
  }

  ldaplist() {
    let url = this.baseUrl + '/ldap/list'
    return this._http.get(url, {
      observe: 'response'
    });
  }

  listldapuser() {
    let url = this.baseUrl + '/ldap/listldapuser'
    return this._http.get(url)
  }

  createldapuser(formData: any) {
    let url = this.baseUrl + '/ldap/createldapuser'
    this._http.post(url, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  getUserName() {
    let url = this.baseUrl + '/users/username';
    return this._http.get(url, {
      observe: 'body',
      params: new HttpParams().append('token', localStorage.getItem('token'))
    });
  }

  getAll() {
    let url = this.baseUrl + '/users/all'
    return this._http.get(url, {
      observe: 'response'
    });
  }

  deleteUser(id) {
    let url = this.baseUrl + '/ldap/deleteldapuser/'  + id
    this._http.delete(url).subscribe(
      (res) => {
        return res
      },
      (err) => {
        return err
      }
    );
  }


}

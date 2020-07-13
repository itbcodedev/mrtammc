import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GtfsdbService {

  baseUrl = environment.baseUrl;

  gtfsdb_url = `${this.baseUrl}/gtfsdb`;

  constructor(private _http: HttpClient) { }

  // utils
  liveupdate(model: any, obj: any) {
    console.log('liveupdate')
    console.log(model)
    console.log(obj)
    return this._http.post(this.gtfsdb_url + '/liveupdate/' + model, obj);
  }

  // Agency
  getAgencies() {
    return this._http.get(this.gtfsdb_url+ "/agencies")
  }
  addAgency(data: any) {
    console.log("add Agency to db", data)
    return this._http.post(this.gtfsdb_url+ "/agencies", data)
  }

  // Calendar
  getCalendars() {
    return this._http.get(this.gtfsdb_url+ "/calendars")
  }
  addCalendar(data: any) {
    console.log("add Agency to db", data)
    return this._http.post(this.gtfsdb_url+ "/calendars", data)
  }

  // Calendar date
  getCalendardates() {
    return this._http.get(this.gtfsdb_url+ "/calendardates")
  }
  addCalendardates(data: any) {
    console.log("add Calendar date to db", data)
    return this._http.post(this.gtfsdb_url+ "/calendardates", data)
  }

  // Fareattribute
  getFareattributes() {
    return this._http.get(this.gtfsdb_url+ "/fareattributes")
  }
  addFareattribute(data: any) {
    console.log("add Fareattribute to db", data)
    return this._http.post(this.gtfsdb_url+ "/fareattributes", data)
  }

  // Farerule
  getFarerules() {
    return this._http.get(this.gtfsdb_url+ "/farerules")
  }
  addFarerule(data: any) {
    console.log("add Farerule to db", data)
    return this._http.post(this.gtfsdb_url+ "/farerules", data)
  }
  // Frequency
  getFrequencies() {
    return this._http.get(this.gtfsdb_url+ "/frequencies")
  }
  addFrequency(data: any) {
    console.log("add Frequency to db", data)
    return this._http.post(this.gtfsdb_url+ "/frequencies", data)
  }
  // Route
  getRoutes() {
    return this._http.get(this.gtfsdb_url+ "/routes")
  }
  addRoute(data: any) {
    console.log("add Route to db", data)
    return this._http.post(this.gtfsdb_url+ "/routes", data)
  }

  // Shape
  getShapes() {
    return this._http.get(this.gtfsdb_url+ "/shapes")
  }
  addShape(data: any) {
    console.log("add Route to db", data)
    return this._http.post(this.gtfsdb_url+ "/shapes", data)
  }

  // Stop
  getStops() {
    return this._http.get(this.gtfsdb_url+ "/stops")
  }
  addStop(data: any) {
    console.log("add Stop to db", data)
    return this._http.post(this.gtfsdb_url+ "/stops", data)
  }

  // Stoptime
  getStoptimes() {
    return this._http.get(this.gtfsdb_url+ "/stoptimes")
  }
  addStoptime(data: any) {
    console.log("add Stoptime to db", data)
    return this._http.post(this.gtfsdb_url+ "/stoptimes", data)
  }

  // Transfer
  getTransfers() {
    return this._http.get(this.gtfsdb_url+ "/transfers")
  }


  addTransfer(data: any) {
    console.log("add Transfer to db", data)
    return this._http.post(this.gtfsdb_url+ "/transfers", data)
  }

  // Trips
  getTrips() {
    return this._http.get(this.gtfsdb_url+ "/trips")
  }

  addTrip(data: any) {
    console.log("add Trip to db", data)
    return this._http.post(this.gtfsdb_url+ "/trips", data)
  }

  // pathway
  // Trips
  getPathways() {
    return this._http.get(this.gtfsdb_url+ "/pathways")
  }

  addPathway(data: any) {
    console.log("add Trip to db", data)
    return this._http.post(this.gtfsdb_url+ "/pathways", data)
  }

  // Trips
  getLevels() {
    return this._http.get(this.gtfsdb_url+ "/levels")
  }

  addLevel(data: any) {
    console.log("add Trip to db", data)
    return this._http.post(this.gtfsdb_url+ "/levels", data)
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Stop } from '../models/stop.model';
import { Route } from '../models/route.model';
import { Agency } from '../models/agency.model';
import { Trip } from '../models/trip.model';
import { Calendar } from '../models/calendar.model';
import { StopTime } from '../models/stop_time.model';
import { Shape } from '../models/shape.model';
import { ShapeDetail } from '../models/shape_detail';

const BASE_API_ENDPOINT = '/api/v2';

@Injectable({
  providedIn: 'root'
})
export class GtfsService {

  constructor(private http: HttpClient) {}

  public getAgencies(): Promise<Agency[]> {
    return this.http.get<Agency[]>(`${BASE_API_ENDPOINT}/agencies`).toPromise();
  }

  public getStops(): Promise<Stop[]> {
    return this.http.get<Stop[]>(`${BASE_API_ENDPOINT}/stops`).toPromise();
  }

  public updateStops(data): Promise<Stop[]> {
    return this.http.put<Stop[]>(`${BASE_API_ENDPOINT}/stops`,data).toPromise();
  }

  public createStops(data): Promise<Stop[]> {
    return this.http.post<Stop[]>(`${BASE_API_ENDPOINT}/stops`,data).toPromise();
  }


  public deleteStops(data) {
    return this.http.delete(`${BASE_API_ENDPOINT}/stops/${data}`).toPromise();
  }

  public getRoutes(): Promise<Route[]> {
    return this.http.get<Route[]>(`${BASE_API_ENDPOINT}/routes`).toPromise();
  }

  public getRoutesBasic(): Promise<Route[]> {
    return this.http.get<Route[]>(`${BASE_API_ENDPOINT}/routesbasic`).toPromise();
  }

  public getShapeDetail(): Promise<ShapeDetail[]> {
    return this.http.get<ShapeDetail[]>(`${BASE_API_ENDPOINT}/shape_details`).toPromise();
  }

  public getShapes(): Promise<Shape[]> {
    return this.http.get<Shape[]>(`${BASE_API_ENDPOINT}/shapes`).toPromise();
  }

  public getTrips(): Promise<Trip[]> {
    return this.http.get<Trip[]>(`${BASE_API_ENDPOINT}/trips`).toPromise();
  }

  public getStopTimes(agency_key,route_id) {
    return this.http.get(`${BASE_API_ENDPOINT}/stoptimes/${agency_key}/${route_id}`).toPromise();
  }

  public getStopTimesBasic(agency_key,trip_id) {
    return this.http.get(`${BASE_API_ENDPOINT}/stoptimes_basic/${agency_key}/${trip_id}`).toPromise();
  }

  public allStopTimes() {
    return this.http.get(`${BASE_API_ENDPOINT}/allstoptimes`).toPromise();
  }
  // public getStopTimes(agency_key,route_id): Promise<StopTime[]> {
  //   return this.http.get<StopTime[]>(`${BASE_API_ENDPOINT}/stoptimes`).toPromise();
  // }

  public getStopTimesByTrip(tripId: any): Promise<StopTime[]> {
    return this.http.get
    <StopTime[]>(`${BASE_API_ENDPOINT}/stoptimes/${tripId}`).toPromise();
  }

  public getStopTimesByStop(stopId: any): Promise<StopTime[]> {
    return this.http.get
    <StopTime[]>(`${BASE_API_ENDPOINT}/stoptimesbystop/${stopId}`).toPromise();
  }

  public getCalendars(): Promise<Calendar[]> {
    return this.http.get<Calendar[]>(`${BASE_API_ENDPOINT}/calendars`).toPromise();
  }

  public getCalendarByService(serviceId: string): Promise<Calendar> {
    return this.http
      .get<Calendar>(`${BASE_API_ENDPOINT}/calendar?serviceId=${serviceId}`)
      .toPromise();
  }

  public getRoutesByAgency(agencyId: string): Promise<Route[]> {
    return this.http
      .get<Route[]>(`${BASE_API_ENDPOINT}/routes/${agencyId}`)
      .toPromise();
  }

  public getTripByRoute(routeId: string): Promise<Trip[]> {
    return this.http
      .get<Trip[]>(`${BASE_API_ENDPOINT}/trips/${routeId}`)
      .toPromise();
  }

  public getStopByTrips(): Promise<Stop[]> {
    return this.http
      .get<Stop[]>(`${BASE_API_ENDPOINT}/stopsbytrip`)
      .toPromise();
  }

  public getStopByTrip(tripId: string): Promise<Stop[]> {
    return this.http
      .get<Stop[]>(`${BASE_API_ENDPOINT}/stopsbytrip?tripId=${tripId}`)
      .toPromise();
  }

  public getTrainByTrip(tripId: string): Promise<Stop[]> {
    return this.http
      .get<Stop[]>(`${BASE_API_ENDPOINT}/trainbytrip?tripId=${tripId}`)
      .toPromise();
  }

  public getstopwithroutes(): Promise<any> {
    return this.http
      .get<any>(`${BASE_API_ENDPOINT}/stopwithroutes`)
      .toPromise();
  }

  public getRouteInfo(): Promise<any> {
    return this.http
      .get<any>(`${BASE_API_ENDPOINT}/routeinfos`)
      .toPromise();
  }

  public getallstations(): Promise<any> {
    return this.http
      .get<any>(`${BASE_API_ENDPOINT}/getallstops`)
      .toPromise();
  }
  
  public updateActiveTrains(trains: any) {
    return this.http.post(`${BASE_API_ENDPOINT}/updateactivetrains`, trains, {observe: 'response' } );
  }

  // localhost:3000/api/v2/routeinfowithtrip/052646
  public getrouteinfowithtrip(tripId: any): Promise<any> {
    //console.log("+++++++++++++++++++++++++++++", tripId)
    return this.http
      .get<any>(`${BASE_API_ENDPOINT}/routeinfowithtrip/${tripId}`)
      .toPromise();
  }
zz
}

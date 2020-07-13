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

const BASE_API_ENDPOINT = '/api/v1';

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

  public getRoutes(): Promise<Route[]> {
    return this.http.get<Route[]>(`${BASE_API_ENDPOINT}/routes`).toPromise();
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

  public getStopTimes(): Promise<StopTime[]> {
    return this.http.get<StopTime[]>(`${BASE_API_ENDPOINT}/stoptimes`).toPromise();
  }

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

  public updateActiveTrains(trains: any) {
    return this.http.post(`${BASE_API_ENDPOINT}/updateactivetrains`, trains, {observe: 'response' } );
  }

}

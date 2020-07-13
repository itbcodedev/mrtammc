import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
import io from 'socket.io-client';
import { Observable, of, Subject, Subscription, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GtfsrtwsService {
  private socket;
  constructor() {
    this.socket = io(environment.ws_url);
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data)
      })
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data)
  }

}
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  baseSocket = environment.baseSocket;

  //create socket connection
  socket: any;
  readonly url: string = this.baseSocket

  constructor() {
    this.socket = io(this.url);
  }

  listen(eventName: string) {
    return new Observable( (subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data)
      })
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data)
  }
}

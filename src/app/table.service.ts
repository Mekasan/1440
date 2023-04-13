import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ApiSearchRequest } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class TableService {
    ELEMENT_DATA: Event[] = [
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 40}).toString(), eventType: 0, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 40}).toString(), eventType: 0, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 40}).toString(), eventType: 0, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 40}).toString(), eventType: 2, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 40}).toString(), eventType: 2, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 10}).toString(), eventType: 2, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 10}).toString(), eventType: 1, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 10}).toString(), eventType: 1, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 10}).toString(), eventType: 1, owner:{profileName:'1234'}},
        {title: 'awesome',date: new Date().toISOString(), createdAt: DateTime.now().minus({hour: 10}).toString(), eventType: 1, owner:{profileName:'1234'}},
    ];
  constructor(
      private http: HttpClient,

  ) { }

serialize(elements:Event[]) {
      return elements.map(item => {
          return {
              title: item['title'],
              date: item['date'],
              createdAt: item['createdAt'],
              eventType: item['eventType'],
              // @ts-ignore
              owner: item.hasOwnProperty('owner') && item['owner'].hasOwnProperty('profileName') ? item['owner']['profileName']: '',
          }
      });
}

getData(request: ApiSearchRequest) {
      console.log('request',request)
    return of(this.serialize(this.ELEMENT_DATA)).pipe();
    // return this.http.post('http://event-social-stage.herokuapp.com/parse/classes/Event', request)
  }
}

export interface Event {
    createdAt: string;
    eventType: number;
    date: string;
    owner: string | {profileName:string};
    title: string;
}

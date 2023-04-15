import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiSearchRequest } from './app.component';
import  * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(
      private http: HttpClient,

  ) { }

serialize(elements:Event[]) {
      return elements.map(item => {
          return {
              title: item['title'],
              date: item['date']['iso'],
              createdAt: item['createdAt'],
              eventType: item['eventType'],
              owner: item.hasOwnProperty('owner') && item['owner'].hasOwnProperty('profileName') ? item['owner']['profileName']: '',
          }
      });
}

getData(request: ApiSearchRequest) {
   const headers = new HttpHeaders({
      'X-Parse-Application-Id': 'jf9j_fJfiP90',
      'Content-Type': 'application/json'
   });
    let params = {};
    let stringParams = '';
    Object.keys(request).map(k => {
        if (typeof request[k] !== 'object') {
            params[k] = request[k];
        } else {
            if (_.isArray(request[k])) {
                params[k] = request[k].join(',')
            } else if(_.isObject(request[k])) {
                Object.keys(request[k]).map(nestK => {
                    stringParams += `${k}=${nestK}`
                })
            }
        }
    });
    // where[isCancelled[$ne]]=false
    return this.http.get<{results: Event[]}>('http://event-social-stage.herokuapp.com/parse/classes/Event?', { headers, params })
        .pipe(map(item => this.serialize(item.results)));
  }
}

export interface Event {
    createdAt: string;
    eventType: number;
    date: string;
    owner: string | {profileName:string};
    title: string;
}

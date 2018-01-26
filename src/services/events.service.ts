import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const API_BASE = 'http://localhost:8080/';
const EVENTS_END_POINT = '/events';

@Injectable()
export class EventsService {

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, perPage: number = 10): Observable<any> {
    return this.http.get(`${API_BASE}${EVENTS_END_POINT}`);
  }
}
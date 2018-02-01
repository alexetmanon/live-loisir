import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { Event } from '../models/event';

const API_BASE = 'http://api.live-loisirs.alexandrebonhomme.fr';
const EVENTS_END_POINT = '/events';

@Injectable()
export class EventsService {

  private eventsSubject = new ReplaySubject<Event[]>();

  constructor(private http: HttpClient) {
    this.refreshEvents();
  }

  refreshEvents(): void {
    this.http.get(`${API_BASE}${EVENTS_END_POINT}`).subscribe(data => this.eventsSubject.next(data));
  }

  getAll(page: number = 0, perPage: number = 10): Observable<Event[]> {
    return this.eventsSubject.asObservable();
  }
}
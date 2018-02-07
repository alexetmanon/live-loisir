import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map, withLatestFrom, catchError } from 'rxjs/operators';

import { Event } from '../models/event';
import { DayEvents } from '../models/day-events';
import { DaySelectorService } from './day-selector.service';

const API_BASE = 'http://api.live-loisirs.alexetmanon.fr';
const EVENTS_END_POINT = '/events/7days';

@Injectable()
export class EventsService {

  private eventsSubject = new ReplaySubject<DayEvents[]>();

  constructor(
    private http: HttpClient,
    private daySelectorService: DaySelectorService
  ) {
    this.refreshEvents();
  }

  refreshEvents(): void {
    this.http
      .get(`${API_BASE}${EVENTS_END_POINT}`)
      .pipe(
        map(data => <DayEvents[]>data),
        catchError(error => {
          console.error(error);

          return error;
        })
      )
      .subscribe((events: DayEvents[]) => this.eventsSubject.next(events));
  }

  getAll(page: number = 0, perPage: number = 10): Observable<DayEvents[]> {
    return this.eventsSubject.asObservable();
  }

  getDayEvents(): Observable<Event[]> {
    return new Observable(observer => {
      // change initiate by day selector
      this.daySelectorService
      .asObservable()
      .pipe(
        withLatestFrom(this.eventsSubject.asObservable()),
        map(([dayNumber, dayEvents]: [string, DayEvents[]]) => {
          const events = this.filterEventsByDayNumber(dayEvents, dayNumber);

          if (events) {
            return events;
          }
        })
      )
      .subscribe(events => observer.next(events));

      // change initiate by events
      this.eventsSubject
      .asObservable()
      .pipe(
        withLatestFrom(this.daySelectorService.asObservable()),
        map(([dayEvents, dayNumber]: [DayEvents[], string]) => {
          const events = this.filterEventsByDayNumber(dayEvents, dayNumber);

          if (events) {
            return events;
          }
        })
      )
      .subscribe(events => observer.next(events));
    });
  }

  private filterEventsByDayNumber(events: DayEvents[], dayNumber: string) {
    const filteredEvents = events.filter(dayEvent => dayEvent.dayNumber.toString() === dayNumber);

    return filteredEvents && filteredEvents.length ? filteredEvents[0].events : [];
  }
}
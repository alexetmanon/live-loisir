import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map, withLatestFrom, catchError } from 'rxjs/operators';

import { Event } from '../models/event';
import { DayEvents } from '../models/day-events';
import { DaySelectorService } from './day-selector.service';
import { AppSettings } from '../app/app.settings';

import * as moment from 'moment';

const EVENTS_END_POINT = '/events/7days';
const NOW_EVENTS_END_POINT = '/events/now';

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
      .get(`${AppSettings.API_BASE}${EVENTS_END_POINT}`)
      .pipe(
        map(data => <DayEvents[]>data),
        catchError(error => {
          console.error(error);

          return Observable.throw(error);
        })
      )
      .subscribe((dayEvents: DayEvents[]) => {
        dayEvents = dayEvents.map(dayEvent => {
          dayEvent.events = dayEvent.events
            .map(event => this.populateStartAndEndTime(event, dayEvent.date))
            // EXTREMLY DIRTY TRICK TO FIX API BUG
            .filter(event => event.timings.length === 0 || event.startTime);

          return dayEvent;
        })

        this.eventsSubject.next(dayEvents);
      });
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

  /**
   * return an event with startTime and dateTime field with data from timings array
   *
   * @param event
   * @param date
   */
  private populateStartAndEndTime(event: Event, date: Date): Event {
    let current = moment(date);

    let todayTiming = event.timings.filter(timing => current.isSame(timing.start, 'day') && current.isSame(timing.end, 'day'));

    // set start/end for today
    if (todayTiming.length >= 1) {
      event.startTime = todayTiming[0].start;
      event.endTime = todayTiming[0].end;
    }

    // set event date to display in event detail page
    event.date = date;

    return event;
  }

  /**
   *
   */
  getNowEvents(): Observable<Event[]> {
    return this.http
      .get(`${AppSettings.API_BASE}${NOW_EVENTS_END_POINT}`)
      .pipe(
        map(data => <Event[]>data),
        map(events => {
          let today = new Date();

          return events
            .map(event => this.populateStartAndEndTime(event, today))
            // EXTREMLY DIRTY TRICK TO FIX API BUG
            .filter(event => event.timings.length === 0 || event.startTime);
        }),
        catchError(error => {
          console.error(error);

          return Observable.throw(error);
        })
      );
  }
}
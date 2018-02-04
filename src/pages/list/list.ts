import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  dayEvents: DayEvents[] = [];
  events: Event[] = [];

  constructor(eventsService: EventsService) {
    eventsService.getAll().subscribe(data => this.dayEvents = data);
    eventsService.getDayEvents().subscribe(data => this.events = data);
  }
}

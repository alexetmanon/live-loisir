import { Component } from '@angular/core';

import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  dayEvents: DayEvents[];
  events: Event[];
  selectedEvent: Event;

  constructor(
    eventsService: EventsService
   ) {
    eventsService.getAll().subscribe(data => this.dayEvents = data);
    eventsService.getDayEvents().subscribe(data => this.events = data);
  }

  /**
   *
   * @param event
   */
  onMarkerClicked(event: Event): void {
    this.selectedEvent = event;
  }
}

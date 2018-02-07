import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';
import { EventPage } from '../event/event';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  dayEvents: DayEvents[] = [];
  events: Event[] = [];
  selectedEvent: Observable<Event>;

  constructor(
    eventsService: EventsService,
    private navCtrl: NavController
   ) {
    eventsService.getAll().subscribe(data => this.dayEvents = data);
    eventsService.getDayEvents().subscribe(data => this.events = data);
  }

  /**
   *
   * @param event
   */
  onMarkerClicked(event: Event): void {
    this.navCtrl.push(EventPage, {
      event: event
    });
  }
}

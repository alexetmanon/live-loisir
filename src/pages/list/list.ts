import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';
import { EventPage } from '../event/event';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  dayEvents: DayEvents[] = [];
  events: Event[] = [];

  constructor(
    eventsService: EventsService,
    private navCtrl: NavController
  ) {
    eventsService.getAll().subscribe(data => this.dayEvents = data);
    eventsService.getDayEvents().subscribe(data => this.events = data);
  }

  onClick(event: Event): void {
    this.navCtrl.push(EventPage, {
      event: event
    });
  }
}

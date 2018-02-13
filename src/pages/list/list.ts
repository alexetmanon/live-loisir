import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';
import { EventPage } from '../event/event';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  private navController: NavController;

  dayEvents: DayEvents[] = [];
  events: Event[] = [];

  constructor(
    eventsService: EventsService,
    app: App
  ) {
    this.navController = app.getRootNavs()[0];

    eventsService.getAll().subscribe(data => this.dayEvents = data);
    eventsService.getDayEvents().subscribe(data => this.events = data);
  }

  onClick(event: Event): void {
    this.navController.push(EventPage, {
      event: event
    });
  }
}

import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { EventPage } from '../event/event';

@Component({
  selector: 'page-now',
  templateUrl: 'now.html'
})
export class NowPage {
  private navController: NavController;

  events: Event[];

  constructor(
    eventsService: EventsService,
    app: App
  ) {
    this.navController = app.getRootNavs()[0];

    eventsService.getNowEvents().subscribe(data => this.events = data);
  }

  onClick(event: Event): void {
    this.navController.push(EventPage, {
      event: event
    });
  }
}

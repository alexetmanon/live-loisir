import { Component, Input } from '@angular/core';
import { App, NavController } from 'ionic-angular';

import { Event } from '../../models/event';
import { EventPage } from '../../pages/event/event';
import { AppSettings } from '../../app/app.settings';

@Component({
  selector: 'event-card',
  templateUrl: 'event-card.html'
})
export class EventCardComponent {
  private navController: NavController;

  @Input()
  event: Event;

  constructor(
    app: App,
  ) {
    this.navController = app.getRootNavs()[0];
  }

  openEvent(event: Event) {
    this.navController.push(EventPage, {
      event: event
    });
  }
}

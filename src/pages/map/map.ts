import { Component } from '@angular/core';
import { App, NavController, LoadingController } from 'ionic-angular';

import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';
import { EventPage } from '../event/event';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  private navController: NavController;

  dayEvents: DayEvents[] = [];
  events: Event[] = [];

  constructor(
    eventsService: EventsService,
    app: App,
    loadingController: LoadingController
   ) {
    let loading = loadingController.create({
      content: 'Chargement des évènements en cours'
    });
    loading.present();

    this.navController = app.getRootNavs()[0];

    eventsService.getAll().subscribe(data => {
      this.dayEvents = data;

      loading.dismiss();
    });
    eventsService.getDayEvents().subscribe(data => this.events = data);
  }

  /**
   *
   * @param event
   */
  onMarkerClicked(event: Event): void {
    this.navController.push(EventPage, {
      event: event
    });
  }
}

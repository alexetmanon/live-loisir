import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';

import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  dayEvents: DayEvents[] = [];
  events: Event[] = [];
  selectedEvent: Event;

  constructor(
    eventsService: EventsService,
    loadingController: LoadingController
   ) {
    let loading = loadingController.create({
      content: 'Chargement des évènements en cours'
    });
    loading.present();

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
    this.selectedEvent = event;
  }
}

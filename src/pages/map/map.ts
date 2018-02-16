import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';
import { LatLng } from 'leaflet';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  dayEvents: DayEvents[];
  events: Event[];
  selectedEvent: Event;

  mapCenter: LatLng;

  constructor(
    eventsService: EventsService,
    private geolocationService: Geolocation,
    private toastController: ToastController
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

  refreshLocation() {
    this.geolocationService.getCurrentPosition().then(position => {
      console.log(position)
      this.mapCenter = new LatLng(position.coords.latitude, position.coords.longitude);
    }).catch(error => {
      console.log('Error getting location', error)

      this.toastController.create({
        message: 'Impossible récupérer votre position',
        showCloseButton: true,
        closeButtonText: 'Fermer'
      }).present();
    });
  }
}

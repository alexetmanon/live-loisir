import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Event } from '../../models/event';
import { ItineraryService } from '../../services/itinerary.service';
import { TransportMode, PublicTransportMode } from '../../enums/transport-mode';

import { LatLng } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  event: Event;
  itineraries: any;
  itineraryDirection: string = 'forward';

  constructor(
    navParams: NavParams,
    itineraryService: ItineraryService,
    geolocationService: Geolocation
  ) {
    this.event = <Event>navParams.get('event');

    geolocationService.getCurrentPosition().then(position => {
      itineraryService.get(
        new LatLng(position.coords.latitude, position.coords.longitude),
        new LatLng(this.event.location.latitude, this.event.location.longitude),
        {
          datetime: (new Date()).toISOString(),
          // beforeDatetime: true,
          sectionModes: [
            // TransportMode.Bike,
            TransportMode.Walking
          ],
          publicModes: [
            PublicTransportMode.Tramway,
            PublicTransportMode.Metro,
            PublicTransportMode.Bus
          ]
        }
      ).subscribe(data => {
        this.itineraries = data.journeys
      });
    }).catch(error => console.log('Error getting location', error));
  }

  formatDuration(durationInSecond: number): string {
    const duration = durationInSecond > 0 ? Math.round(durationInSecond / 60) : 0;

    return `${duration} minute${duration > 1 ? 's' : ''}`;
  }

  formatPrice(fare: any): string {
    let price = '0.0';
    if (fare && fare.total && fare.total.value) {
      price = fare.total.value;
    }

    return `${price} €`;
  }
}

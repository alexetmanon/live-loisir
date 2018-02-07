import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Event } from '../../models/event';
import { ItineraryService } from '../../services/itinerary.service';
import { TransportMode, PublicTransportMode } from '../../enums/transport-mode';

import { LatLng } from 'leaflet';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  event: Event;
  itineraries: any;

  constructor(
    navParams: NavParams,
    itineraryService: ItineraryService
  ) {
    this.event = <Event>navParams.get('event');

    itineraryService
      .get(
        new LatLng(50.6216869, 3.0612344),
        new LatLng(this.event.location.latitude, this.event.location.longitude),
        {
          datetime: (new Date()).toISOString(),
          // beforeDatetime: true,
          sectionModes: [
            TransportMode.Bike,
            TransportMode.Walking
          ],
          publicModes: [
            PublicTransportMode.Tramway
          ]
        }
      )
      .subscribe(data => {
        console.log(data)
        this.itineraries = data
      });
  }
}

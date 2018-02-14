import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Event } from '../../models/event';
import { ItineraryService } from '../../services/itinerary.service';

import { LatLng } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-itinerary',
  templateUrl: 'itinerary.html',
})
export class ItineraryPage {

  event: Event;
  itineraryDirection: string = 'forward';
  itinerary: any;

  constructor(
    navParams: NavParams,
    private itineraryService: ItineraryService,
    geolocationService: Geolocation
  ) {
    this.event = <Event>navParams.get('event');
    this.itinerary = navParams.get('itinerary');
  }
}

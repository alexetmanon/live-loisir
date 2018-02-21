import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { Event } from '../../models/event';
import { ItineraryMapPage } from '../itinerary-map/itinerary-map';

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
    private navController: NavController
  ) {
    this.event = <Event>navParams.get('event');
    this.itinerary = navParams.get('itinerary');
    this.itineraryDirection = navParams.get('itineraryDirection');
  }

  openMap(to: any) {
    this.navController.push(ItineraryMapPage, {
      to: to
    })
  }
}

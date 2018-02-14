import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Event } from '../../models/event';

@Component({
  selector: 'page-itinerary',
  templateUrl: 'itinerary.html',
})
export class ItineraryPage {

  event: Event;
  itineraryDirection: string = 'forward';
  itinerary: any;

  constructor(
    navParams: NavParams
  ) {
    this.event = <Event>navParams.get('event');
    this.itinerary = navParams.get('itinerary');
  }
}

import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { Event } from '../../models/event';
import { ItineraryService } from '../../services/itinerary.service';
import { ItineraryPage } from '../itinerary/itinerary';

import { LatLng } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  event: Event;
  eventMapCenter: LatLng;

  itineraryDirection: string = 'forward';

  itineraries: any[];

  constructor(
    navParams: NavParams,
    private navController: NavController,
    private itineraryService: ItineraryService,
    geolocationService: Geolocation
  ) {
    this.event = <Event>navParams.get('event');
    this.eventMapCenter = new LatLng(this.event.location.latitude, this.event.location.longitude)

    geolocationService.getCurrentPosition().then(position => {
      this.loadsItineraries(new LatLng(position.coords.latitude, position.coords.longitude), this.event);
    }).catch(error => {
      // TODO: add toast
      console.log('Error getting location', error)
    });
  }

  private loadsItineraries(position: LatLng, event: Event, direction: string = 'forward') {
    let from = new LatLng(position.lat, position.lng);
    let to = new LatLng(event.location.latitude, event.location.longitude);

    // we do not have start/end time for now
    let options = (direction === 'forward') ? {
      departure: (new Date()).toISOString()
    } : {
      departure: (new Date()).toISOString()
      // arrival: (new Date()).toISOString()
    };

    this.itineraryService
      .getItineraries(from, to, options)
      .then(itineraries => this.itineraries = itineraries);
  }

  openItinerary(itinerary: any): void {
    this.navController.push(ItineraryPage, {
      event: this.event,
      itinerary: itinerary
    });
  }
}

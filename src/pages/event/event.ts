import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Event } from '../../models/event';
import { ItineraryService } from '../../services/itinerary.service';

import { LatLng } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  event: Event;

  itineraryDirection: string = 'forward';

  itineraries: any[];

  constructor(
    navParams: NavParams,
    private itineraryService: ItineraryService,
    geolocationService: Geolocation
  ) {
    this.event = <Event>navParams.get('event');

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

    Promise.all([
      this.itineraryService
        .getPublicTransportsItinerary(from, to, options)
        .then(data => data.journeys),

      this.itineraryService
        .getWalkingItinerary(from, to, options)
        .then(data => data.routes),

      this.itineraryService
        .getCyclingItinerary(from, to, options)
        .then(data => data.routes),

      this.itineraryService
        .getDrivingItinerary(from, to, options)
        .then(data => data.routes)
    ]).then(data => {
      this.itineraries = [
        ...data[0].map(itinerary => Object.create({
          'icon': 'subway',
          'duration': itinerary.duration,
          // 'price': this.formatPrice(itinerary.price)
          'price': '-- €'
        })),
        ...data[1].map(itinerary => Object.create({
          'icon': 'walk',
          'duration': itinerary.duration,
          'price': '0 €'
        })),
        ...data[2].map(itinerary => Object.create({
          'icon': 'bicycle',
          'duration': itinerary.duration,
          'price': '0 €'
        })),
        ...data[3].map(itinerary => Object.create({
          'icon': 'car',
          'duration': itinerary.duration,
          'price': '-- €'
        })),
      ]
      .sort((a, b) => a.duration - b.duration)
      .map(itinerary => {
        itinerary.duration = this.formatDuration(itinerary.duration);

        return itinerary;
      });
    });
  }

  formatDuration(durationInSecond: number): string {
    const duration = durationInSecond > 0 ? Math.round(durationInSecond / 60) : 0;

    return `${duration} minute${duration > 1 ? 's' : ''}`;
  }

  formatPrice(fare: any): string {
    let price = '--';
    if (fare && fare.total && fare.total.value) {
      price = fare.total.value.replace('.', ',');
    }

    return `${price} €`;
  }
}

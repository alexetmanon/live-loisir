import { Component } from '@angular/core';
import { NavParams, NavController, ToastController } from 'ionic-angular';

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

  forwardItineraries: any[];
  backwardItineraries: any[];

  constructor(
    navParams: NavParams,
    private navController: NavController,
    private itineraryService: ItineraryService,
    geolocationService: Geolocation,
    private toastController: ToastController
  ) {
    this.event = <Event>navParams.get('event');
    this.eventMapCenter = new LatLng(this.event.location.latitude, this.event.location.longitude)

    geolocationService.getCurrentPosition().then(position => {
      this.loadsItineraries(new LatLng(position.coords.latitude, position.coords.longitude), this.event);
    }).catch(error => {
      console.log('Error getting location', error)

      this.toastController.create({
        message: 'Impossible récupérer votre position',
        showCloseButton: true,
        closeButtonText: 'Fermer'
      }).present();
    });
  }

  private loadsItineraries(position: LatLng, event: Event) {
    let from = new LatLng(position.lat, position.lng);
    let to = new LatLng(event.location.latitude, event.location.longitude);

    let forwardOptions;
    let backwardOptions;

    if (event.startTime) {
      forwardOptions = {
        arrival: event.startTime
      };
    }

    if (event.endTime) {
      backwardOptions = {
        departure: event.endTime
      };
    }

    // compute forward itineraries
    this.itineraryService
      .getItineraries(from, to, forwardOptions)
      .then(itineraries => this.forwardItineraries = itineraries)
      .catch(error => {
        console.log('Error computing intineraries', error);

        this.toastController.create({
          message: 'Impossible de calculer les itinéraires',
          showCloseButton: true,
          closeButtonText: 'Fermer'
        }).present();
      });

    // compute backward itineraries
    this.itineraryService
      .getItineraries(to, from, backwardOptions)
      .then(itineraries => this.backwardItineraries = itineraries)
      .catch(error => {
        console.log('Error computing intineraries', error);

        this.toastController.create({
          message: 'Impossible de calculer les itinéraires',
          showCloseButton: true,
          closeButtonText: 'Fermer'
        }).present();
      });
  }

  openItinerary(itinerary: any): void {
    this.navController.push(ItineraryPage, {
      event: this.event,
      itinerary: itinerary,
      itineraryDirection: <string>(this.itineraryDirection) // bugfix ion-segment bad varible type
    });
  }

  hasPublicTransport(itineraries: any[]): boolean {
    if (!itineraries) {
      return false;
    }

    return itineraries.filter(itinerary => itinerary.type === 'public_transport').length > 0;
  }
}
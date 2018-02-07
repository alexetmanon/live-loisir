import { Component, Input, Output, EventEmitter } from '@angular/core';
import { tileLayer, latLng, marker, icon, point, Marker } from 'leaflet';

import { Event } from '../../models/event';

const TOURCOING_LATLNG = latLng(50.7226638, 3.1519897);
const ZOOM_DEFAULT = 14;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  private markers: Marker[] = [];

  // map options
  options = {
    layers: [
      // tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}')
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ],
    zoom: ZOOM_DEFAULT,
    zoomControl: false,
    center: TOURCOING_LATLNG,
  };

  @Input()
  set events(events: Event[]) {
    if (!events) {
      return;
    }

    this.markers = events.map(event => this.buildMarker(event));
  };

  get layers(): Marker[] {
    return this.markers;
  }

  @Output()
  onMarkerClicked = new EventEmitter<Event>();

  /**
   *
   * @param {Event} event
   * @returns {Marker}
   */
  private buildMarker(event: Event): Marker {
    let markerObject = marker(latLng(event.location.latitude, event.location.longitude), {
      icon: icon({
        iconUrl: 'assets/imgs/pin-general.png',
        iconRetinaUrl: 'assets/imgs/pin-general@2x.png',
        iconSize: point(35, 55),
        iconAnchor: point(32, 27)
      })
    });

    // emit event corresponding to the clicked marker
    markerObject.on('click', () => this.onMarkerClicked.emit(event));

    return markerObject;
  }

}

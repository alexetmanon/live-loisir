import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { tileLayer, latLng, marker, icon, point, Marker, LatLng } from 'leaflet';

import { Event } from '../../models/event';

const TOURCOING_LATLNG = latLng(50.7226638, 3.1519897);
const ZOOM_DEFAULT = 14;

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NDg1bDA1cjYzM280NHJ5NzlvNDMifQ.d6e-nNyBDtmQCVwVNivz7A';

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  private markers: Marker[] = [];

  // map options
  options = {
    layers: [
      // tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      tileLayer(
        `https://a.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}{retina}.png?access_token=${MAPBOX_TOKEN}`,
        {
          retina: '@2x',
          detectRetina: true
        }
      )
    ],
    zoom: ZOOM_DEFAULT,
    zoomControl: false,
    center: TOURCOING_LATLNG,
  };

  @Input()
  set events(events: Event[]|Event) {
    if (!events) {
      return;
    }

    if (Array.isArray(events)) {
      this.markers = events.map(event => this.buildMarker(event));
    } else {
      this.markers = [this.buildMarker(events)];
    }
  };

  get layers(): Marker[] {
    return this.markers;
  }

  @Input()
  set center(center: LatLng) {
    this.options.center = center;
  }

  @Output()
  onMarkerClicked = new EventEmitter<Event>();

  constructor(private ngZone: NgZone) {}

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
    markerObject.on('click',
      // get back into zone
      () => this.ngZone.run(
        () => this.onMarkerClicked.emit(event)
      )
    );

    return markerObject;
  }

}

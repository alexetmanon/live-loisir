import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
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
      // tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      tileLayer('https://api.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmxja3NocmsiLCJhIjoiY2pkbXRxemJzMG1qYjJ5cDJnYzZkcWdvciJ9.T_Yp_y3P8LdAxYBx5P8ZmA')
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

import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { tileLayer, latLng, marker, icon, point, Marker, LatLng, Map } from 'leaflet';

import { Event } from '../../models/event';
import { AppSettings } from '../../app/app.settings';
import { Category } from '../../enums/category';

const TOURCOING_LATLNG = latLng(50.7226638, 3.1519897);
const ZOOM_DEFAULT = 14;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {

  private map: Map;
  private markers: Marker[] = [];
  private mapCenter: LatLng;
  private isZoomAndPanDisabled: boolean = false;

  options = {
    layers: [
      // tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      tileLayer(
        `https://a.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}{retina}.png?access_token=${AppSettings.MAPBOX.API_TOKEN}`,
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
  set center(position: LatLng) {
    if (!position) {
      return;
    }

    this.mapCenter = position;
    this.options.center = position;
  };

  get center() {
    return this.mapCenter;
  }

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
  }

  get layers(): Marker[] {
    return this.markers;
  }

  @Input()
  set disableZoomAndPan(disable: boolean) {
    this.isZoomAndPanDisabled = disable;

    if (!this.map) {
      return;
    }

    if (this.isZoomAndPanDisabled) {
      this.map.dragging.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
    } else {
      this.map.dragging.enable();
      this.map.touchZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.scrollWheelZoom.enable();
    }
  }

  @Output()
  onMarkerClicked = new EventEmitter<Event>();

  constructor(private ngZone: NgZone) {}

  onMapReady(map: Map) {
    this.map = map;

    if (this.isZoomAndPanDisabled) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
    }
  }

  /**
   *
   * @param {Event} event
   * @returns {Marker}
   */
  private buildMarker(event: Event): Marker {
    let markerObject = marker(latLng(event.location.latitude, event.location.longitude), {
      icon: this.iconFromCategory(event.category)
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

  /**
   *
   * @param {string} category
   * @returns {Icon}
   */
  private iconFromCategory(category?: string) {
    switch (category) {
      case Category.Outside:
        return icon({
          iconUrl: 'assets/imgs/pin-musee.png',
          iconRetinaUrl: 'assets/imgs/pin-musee@2x.png',
          iconSize: point(35, 55)
        });

      case Category.Show:
        return icon({
          iconUrl: 'assets/imgs/pin-theatre.png',
          iconRetinaUrl: 'assets/imgs/pin-theatre@2x.png',
          iconSize: point(35, 55)
        });

      case Category.Concert:
        return icon({
          iconUrl: 'assets/imgs/pin-musique.png',
          iconRetinaUrl: 'assets/imgs/pin-musique@2x.png',
          iconSize: point(35, 55)
        });

      default:
        return icon({
          iconUrl: 'assets/imgs/pin-general.png',
          iconRetinaUrl: 'assets/imgs/pin-general@2x.png',
          iconSize: point(35, 55)
        });
    }
  }
}

import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { tileLayer, latLng, marker, icon, point, Marker, LatLng } from 'leaflet';

import { AppSettings } from '../../app/app.settings';

const TOURCOING_LATLNG = latLng(50.7226638, 3.1519897);
const ZOOM_DEFAULT = 18;

@Component({
  selector: 'page-itinerary-map',
  templateUrl: 'itinerary-map.html',
})
export class ItineraryMapPage {

  title: string;
  marker: Marker;

  get layers() {
    return [this.marker];
  }

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

  constructor(
    navParams: NavParams
  ) {
    let to = navParams.get('to');
    if (!to) {
      return;
    }

    if (to.address) {
      let position = new LatLng(to.address.coord.lat, to.address.coord.lon);

      this.options.center = position;
      this.title = to.address.label;
      this.marker = this.buildMarker(position);
    } else if (to.stop_point) {
      let position = new LatLng(to.stop_point.coord.lat, to.stop_point.coord.lon);

      this.options.center = position;
      this.title = `Arrêt ${to.stop_point.label}`;
      this.marker = this.buildMarker(position);
    }
  }

  buildMarker(position: LatLng) {
    return marker(position, {
      icon: icon({
        iconUrl: 'assets/imgs/pin-general.png',
        iconRetinaUrl: 'assets/imgs/pin-general@2x.png',
        iconSize: point(35, 55)
      })
    });
  }
}

import { Component } from '@angular/core';

import { tileLayer, latLng } from 'leaflet';

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {
  options = {
    layers: [
      tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
        maxZoom: 18,
        attribution: '...'
      })
    ],
    zoom: 14,
    zoomControl: false,
    center: latLng(50.6303889, 3.0556133),
  };
}

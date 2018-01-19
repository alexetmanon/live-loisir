import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { tileLayer, latLng } from 'leaflet';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  options = {
    layers: [
      tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 14,
    center: latLng(50.6303889, 3.0556133)
  };

  constructor(public navCtrl: NavController) {

  }

}

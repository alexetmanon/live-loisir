
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TransportMode, PublicTransportMode } from '../enums/transport-mode';

import { LatLng } from 'leaflet';

const NAVITIA_API_BASE = 'https://api.navitia.io/v1';
const NAVITIA_API_ENDPOINT = '/coverage/fr-npdc/journeys';
// const API_TOKEN = '8b0348d6-1dcf-4980-b65b-62f75479b9f2';
const NAVITIA_API_TOKEN = 'c8034b39-a6ed-41fb-8ea3-904f2b2e8069'; // Transpole token, oops!

const MAPBOX_API_BASE = 'https://api.mapbox.com/directions/v5/mapbox';
const MAPBOX_API_TOKEN = 'pk.eyJ1IjoiYmxja3NocmsiLCJhIjoiY2pkbXRxemJzMG1qYjJ5cDJnYzZkcWdvciJ9.T_Yp_y3P8LdAxYBx5P8ZmA';

@Injectable()
export class ItineraryService {

  constructor(private http: HttpClient) {}

  getItineraries(from: LatLng, to: LatLng, options?: any): Promise<any> {
    return Promise.all([
      this
        .getPublicTransportsItinerary(from, to, options)
        .then(data => data.journeys),
      this
        .getWalkingItinerary(from, to, options)
        .then(data => data.routes),
      this
        .getCyclingItinerary(from, to, options)
        .then(data => data.routes),
      this
        .getDrivingItinerary(from, to, options)
        .then(data => data.routes)
    ]).then(data => {
      return [
        ...data[0].map(itinerary => this.formatItinerary(itinerary, 'subway')),
        ...data[1].map(itinerary => this.formatItinerary(itinerary, 'walk', 0)),
        ...data[2].map(itinerary => this.formatItinerary(itinerary, 'bicycle', 0)),
        ...data[3].map(itinerary => this.formatItinerary(itinerary, 'car', 0)),
      ]
      .sort((a, b) => a.duration - b.duration)
      .map(itinerary => {
        itinerary.duration = this.formatDuration(itinerary.duration);

        return itinerary;
      });
    });
  }

  getDrivingItinerary(from: LatLng, to: LatLng, options?: any): Promise<any> {
    // return this.mapboxItinerary(from, to, 'driving', options).toPromise();
    return this.mapboxItinerary(from, to, 'driving-traffic', options).toPromise();
  }

  getCyclingItinerary(from: LatLng, to: LatLng, options?: any): Promise<any> {
    return this.mapboxItinerary(from, to, 'cycling', options).toPromise();
  }

  getWalkingItinerary(from: LatLng, to: LatLng, options?: any): Promise<any> {
    return this.mapboxItinerary(from, to, 'walking', options).toPromise();
  }

  getPublicTransportsItinerary(from: LatLng, to: LatLng, options?: any): Promise<any> {
    options = {
      ...options,
      sectionModes: [
        // TransportMode.Bike,
        TransportMode.Walking
      ],
      publicModes: [
        PublicTransportMode.Tramway,
        PublicTransportMode.Metro,
        PublicTransportMode.Bus
      ]
    };

    return this.navitiaItinerary(from, to, options).toPromise();
  }

  private formatItinerary(itinerary: any, iconName: string, price?: number): any {
    let sections = itinerary.sections;
    if (sections) {
      sections = sections.map(section => this.formatSection(section));
    }

    return {
      icon: iconName,
      duration: itinerary.duration,
      price: price ? `${price} €` : '-- €',
      sections: sections
    }
  }

  private formatSection(section: any): any {
    let iconName = '';
    let type = '';

    if (section.mode === 'walking' || section.transfer_type === 'walking') {
      iconName = 'walk';
      type = 'walk';
    }
    else if (section.type === 'waiting') {
      iconName = 'man';
      type = 'wait';
    }
    else if (section.type === 'public_transport' && section.display_informations) {
      switch (section.display_informations.physical_mode) {
        case 'Métro':
          iconName = 'subway';
          type = 'subway';
          break;

        case 'Bus':
          iconName = 'bus';
          type = 'bus';
          break;

        case 'Tram':
          iconName = 'train';
          type = 'tram';
          break;

        default:
          iconName = 'subway';
          type = 'subway';
          break;
      }
    }

    return {
      icon: iconName,
      type: type,
      direction: section.display_informations ? section.display_informations.direction : undefined,
      from: section.from,
      to: section.to,
      duration: this.formatDuration(section.duration)
    }
  }

  private formatDuration(durationInSecond: number): string {
    const duration = durationInSecond > 0 ? Math.round(durationInSecond / 60) : 0;

    return `${duration} minute${duration > 1 ? 's' : ''}`;
  }

  private formatPrice(fare: any): string {
    let price = '--';
    if (fare && fare.total && fare.total.value) {
      price = fare.total.value.replace('.', ',');
    }

    return `${price} €`;
  }

  /**
   *
   * @param from
   * @param to
   * @param mode
   * @param options
   */
  private mapboxItinerary(from: LatLng, to: LatLng, mode: string, options?: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('access_token', `${MAPBOX_API_TOKEN}`);
    params = params.append('language', 'fr');

    return this.http.get(`${MAPBOX_API_BASE}/${mode}/${from.lng},${from.lat};${to.lng},${to.lat}`, {
      params: params
    });
  }

  /**
   *
   * @param from
   * @param to
   * @param options
   */
  private navitiaItinerary(from: LatLng, to: LatLng, options?: any): Observable<any> {
    options = options || {};

    const sectionModes = this.prepareSectionModes(options.sectionModes);
    const forbiddenModes = this.buildForbiddenModes(options.publicModes);

    let params = new HttpParams();
    params = params.append('min_nb_journeys', '1');
    params = params.append('max_nb_journeys', '3');
    params = params.append('from', `${from.lng};${from.lat}`);
    params = params.append('to', `${to.lng};${to.lat}`);
    sectionModes.forEach(mode => {
      params = params.append('first_section_mode[]', mode);
      // params = params.append('last_section_mode[]', mode);
    });
    params = params.append('last_section_mode[]', TransportMode.Walking.toString());
    forbiddenModes.forEach(mode => {
      params = params.append('forbidden_uris[]', mode);
    });

    if (options.departure) {
      params = params.append('datetime', options.departure);
    } else if (options.arrival) {
      params = params.append('datetime', options.arrival);
      params = params.append('datetime_represents', 'arrival');
    }

    return this.http.get(`${NAVITIA_API_BASE}${NAVITIA_API_ENDPOINT}`, {
      headers: {
        Authorization: `${NAVITIA_API_TOKEN}`
      },
      params: params
    });
  }

  /**
   *
   * @param sectionsModes
   */
  private prepareSectionModes(sectionsModes: any): string[] {
    let modes = Array.isArray(sectionsModes) ? sectionsModes : [
      TransportMode.Walking,
      TransportMode.Bike
    ];

    return modes.map(mode => mode.toString());
  }

  /**
   * Build an array of forbidden modes.
   * All modes that aren't in the `allowedModes` are kept
   * @param allowedModes
   */
  private buildForbiddenModes(allowedModes: any): string[] {
     allowedModes = Array.isArray(allowedModes) ? allowedModes : [
      PublicTransportMode.Bus,
      PublicTransportMode.Metro,
      PublicTransportMode.Tramway
    ];

    let forbiddenModes = Object
      // manage to get a array of strings from an enum
      // @see https://github.com/Microsoft/TypeScript/issues/17198#issuecomment-315400819
      .keys(PublicTransportMode)
      .map(key => PublicTransportMode[key as any])
      // kept only transport modes that aren't in allowed array
      .filter(mode => {
        return allowedModes.indexOf(mode) === -1;
      });

    return forbiddenModes;
  }
}
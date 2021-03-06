
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TransportMode, PublicTransportMode } from '../enums/transport-mode';
import { AppSettings } from '../app/app.settings';

import { LatLng } from 'leaflet';
import * as moment from 'moment';

const NAVITIA_API_ENDPOINT = '/coverage/fr-npdc/journeys';

const MAPBOX_DIRECTION_ENDPOINT = '/directions/v5/mapbox';

const DRIVING_COST_PER_KM = 0.1;

@Injectable()
export class ItineraryService {

  constructor(private http: HttpClient) {}

  getItineraries(from: LatLng, to: LatLng, options?: any): Promise<any> {
    options = options || {};

    // if departure is before current time
    if (options.departure) {
      if (moment().isAfter(options.departure)) {
        // we set departure at current time
        options.departure = new Date().toISOString();
      } else {
        options.departure = moment(options.departure).toISOString();
      }
    }

    // if the arrival time is before current time
    if (options.arrival) {
      if (moment().isAfter(options.arrival)) {
        // we remove arrival and set departure instead
        options.arrival = undefined;
        options.departure = new Date().toISOString();
      } else {
        options.arrival = moment(options.arrival).toISOString()
      }
    }

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
        ...data[0].map(itinerary => this.formatItinerary(itinerary, 'public_transport')),
        ...data[1].map(itinerary => this.formatItinerary(itinerary, 'walk')),
        ...data[2].map(itinerary => this.formatItinerary(itinerary, 'bike')),
        ...data[3].map(itinerary => this.formatItinerary(itinerary, 'car')),
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
        TransportMode.BakeSharingSystem,
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

  private computeDrivingCost(distance: number): number {
    const distanceInKm = distance / 1000;

    return Math.round((distanceInKm * DRIVING_COST_PER_KM) * 10) / 10;
  }

  private formatItinerary(itinerary: any, type: string): any {
    let sections = itinerary.sections;
    if (sections) {
      sections = sections.map(section => this.formatSection(section));
    }

    switch (type) {
      case 'walk':
        return {
          icon: 'walk',
          type: type,
          duration: itinerary.duration,
          price: '0 €',
          sections: sections
        };

      case 'bike':
        return {
          icon: 'bicycle',
          type: type,
          duration: itinerary.duration,
          price: '0 €',
          sections: sections
        };

      case 'car':
        let price = this.computeDrivingCost(itinerary.distance);

        return {
          icon: 'car',
          type: type,
          duration: itinerary.duration,
          price: `${price} €`,
          sections: sections
        };

      case 'public_transport':
        return {
          icon: 'subway',
          type: type,
          duration: itinerary.duration,
          price: '1.6 €',
          sections: sections
        };

      default:
        console.error('Wrong itinerary type');
        return;
    }
  }

  private formatSection(section: any): any {
    let iconName = '';
    let type = '';

    if (section.mode === 'walking' || section.transfer_type === 'walking') {
      iconName = 'walk';
      type = 'walk';
    }
    else if (section.mode === 'bike' || section.transfer_type === 'bike') {
      iconName = 'bicycle';
      type = 'bike';
    }
    else if (section.mode === 'bss' || section.transfer_type === 'bss') {
      iconName = 'bycicle';
      type = 'vlille';
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
      transportLabel: section.display_informations ? section.display_informations.label : undefined,
      from: section.from,
      to: section.to,
      start: moment(section.departure_date_time).toDate(),
      end: moment(section.arrival_date_time).toDate(),
      duration: this.formatDuration(section.duration)
    }
  }

  private formatDuration(durationInSecond: number): string {
    const duration = durationInSecond > 0 ? Math.round(durationInSecond / 60) : 0;

    return `${duration} minute${duration > 1 ? 's' : ''}`;
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
    params = params.append('access_token', `${AppSettings.MAPBOX.API_TOKEN}`);
    params = params.append('language', 'fr');

    return this.http.get(`${AppSettings.MAPBOX.API_BASE}${MAPBOX_DIRECTION_ENDPOINT}/${mode}/${from.lng},${from.lat};${to.lng},${to.lat}`, {
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
    params = params.append('direct_path', 'none');

    if (options.departure) {
      params = params.append('datetime', options.departure);
    } else if (options.arrival) {
      params = params.append('datetime', options.arrival);
      params = params.append('datetime_represents', 'arrival');
    }

    return this.http.get(`${AppSettings.NAVITIA.API_BASE}${NAVITIA_API_ENDPOINT}`, {
      headers: {
        Authorization: `${AppSettings.NAVITIA.API_TOKEN}`
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
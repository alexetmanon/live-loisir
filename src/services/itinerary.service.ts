
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TransportMode, PublicTransportMode } from '../enums/transport-mode';

import { LatLng } from 'leaflet';

const API_BASE = 'https://api.navitia.io/v1';
const API_ENDPOINT = '/coverage/fr-npdc/journeys';
// const API_TOKEN = '8b0348d6-1dcf-4980-b65b-62f75479b9f2';
const API_TOKEN = 'c8034b39-a6ed-41fb-8ea3-904f2b2e8069'; // Transpole token, oops!

@Injectable()
export class ItineraryService {

  constructor(private http: HttpClient) {}

  get(from: LatLng, to: LatLng, options?: any): Observable<any> {
    options = options || {};

    const sectionModes = this.prepareSectionModes(options.sectionModes);
    const forbiddenModes = this.buildForbiddenModes(options.publicModes);

    let params = new HttpParams();
    params = params.append('min_nb_journeys', '3'); // min results
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

    if (options.datetime) {
      params = params.append('datetime', options.datetime);
    }

    if (options.beforeDatetime) {
      params = params.append('datetime_represents', 'arrival');
    }

    return this.http.get(`${API_BASE}${API_ENDPOINT}`, {
      headers: {
        Authorization: `${API_TOKEN}`
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
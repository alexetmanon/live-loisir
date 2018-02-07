import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { DayEvents } from '../../models/day-events';
import { ItineraryService } from '../../services/itinerary.service';
import { LatLng } from 'leaflet';
import { TransportMode, PublicTransportMode } from '../../enums/transport-mode';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  dayEvents: DayEvents[] = [];
  events: Event[] = [];

  constructor(eventsService: EventsService, itineraryService: ItineraryService) {
    eventsService.getAll().subscribe(data => this.dayEvents = data);
    eventsService.getDayEvents().subscribe(data => this.events = data);

    itineraryService.get(
      new LatLng(50.6216869, 3.0612344),
      new LatLng(50.6429089, 3.0719164),
      {
        datetime: (new Date()).toISOString(),
        // beforeDatetime: true,
        sectionModes: [
          TransportMode.Bike,
          TransportMode.Walking
        ],
        publicModes: [
          PublicTransportMode.Tramway
        ]
      }
    ).subscribe(console.log);
  }
}

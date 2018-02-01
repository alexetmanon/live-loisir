import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Observable } from 'rxjs/Observable';

import { Event } from '../../models/event';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  events: Observable<Event[]>;

  constructor(eventsService: EventsService) {
    this.events = eventsService.getAll();
  }

}

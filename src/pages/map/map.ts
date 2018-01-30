import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  events: any[];

  constructor(eventsService: EventsService) {
    eventsService.getAll().subscribe(data => this.events = data);
  }

}

import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  events: any[];

  constructor(eventsService: EventsService) {
    eventsService.getAll().subscribe(data => this.events = data);
  }
}

import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  events: Event[] = [];

  constructor(eventsService: EventsService) {
    eventsService.getAll().subscribe(data => this.events = data);
  }
}

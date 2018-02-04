import { Component, Input } from '@angular/core';

import { DaySelectorService } from '../../services/day-selector.service';
import { DayEvents } from '../../models/day-events';

@Component({
  selector: 'day-selector',
  templateUrl: 'day-selector.html'
})
export class DaySelectorComponent {

  currentDay: string;

  @Input()
  events: DayEvents[];

  constructor(private daySelectorService: DaySelectorService) {
    this.daySelectorService.asObservable().subscribe(day => this.currentDay = day);
  }

  onChanged(dayNumber: string) {
    this.daySelectorService.set(dayNumber);
  }
}

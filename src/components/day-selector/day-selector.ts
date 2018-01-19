import { Component } from '@angular/core';

import { DaySelectorService } from '../../services/day-selector.service';

@Component({
  selector: 'day-selector',
  templateUrl: 'day-selector.html'
})
export class DaySelectorComponent {

  currentDay: string;

  constructor(private daySelectorService: DaySelectorService) {
    this.daySelectorService.asObservable().subscribe(day => this.currentDay = day);
  }

  onChanged(day: string) {
    this.daySelectorService.set(day);
  }
}

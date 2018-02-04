import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DaySelectorService {

  private subject = new BehaviorSubject<string>('1');

  constructor() {
    this.set(((new Date()).getDay()).toString());
  }

  set(dayNumber: string): void {
    this.subject.next(dayNumber);
  }

  asObservable(): Observable<string> {
    return this.subject.asObservable();
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DaySelectorService {

  // TODO : enum for days
  private subject = new BehaviorSubject<string>('lundi');

  set(day: string): void {
    this.subject.next(day);
  }

  asObservable(): Observable<string> {
    return this.subject.asObservable();
  }
}
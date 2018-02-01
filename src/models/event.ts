import { EventLocation } from './event-location';
import { EventPublic } from './event-public';
import { EventRate } from './event-rate';

export class Event {
  constructor(
    public title: string,
    public description: string,
    public url: string,
    public image: string,
    public category: string,
    public startDate: Date,
    public endDate: Date,
    public location: EventLocation,
    public publics: EventPublic,
    public rates: EventRate[]
  ) {}
}
import { Event } from "./event";

export class DayEvents {
  constructor(
    public dayName: string,
    public dayNumber: number,
    public events: Event[]
  ) {}
}
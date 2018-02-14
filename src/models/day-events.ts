import { Event } from "./event";

export class DayEvents {
  constructor(
    public date: Date,
    public dayName: string,
    public dayNumber: number,
    public events: Event[]
  ) {}
}
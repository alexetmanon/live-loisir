export class EventRate {
  constructor(
    public label: string,
    public type: string,
    public amount: string,
    public condition?: string
  ) {}
}
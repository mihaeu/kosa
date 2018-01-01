import {Event} from "./Event";

export class EventLog {
    private log: Event[] = [];

    public add(event: Event): this {
        this.log.push(event);
        return this;
    }

    public filter<T extends Event>(type: T): T[] {
        return this.log.filter(event => event instanceof type);
    }
}
import {Event} from "./Event";

export class EventLog {
    private log: Event[] = [];

    public add(event: Event): this {
        this.log.push(event);
        return this;
    }

    public filter(type: any): Event[] {
        return this.log.filter(event => event instanceof type);
    }

    public lastOf(type: any): Event {
        for (let i = this.log.length - 1; i >= 0; --i) {
            if (this.log[i] instanceof type) {
                return this.log[i];
            }
        }
        return null;
    }
}
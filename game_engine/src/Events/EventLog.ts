import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class EventLog {
    public log: Event[] = [];

    public add(event: Event): this {
        this.log.push(event);
        return this;
    }

    public filterBy(playerId: PlayerId, type: any, fn: (event: Event) => boolean = () => true): Event[] {
        return this.log.filter((event) => event.playerId === playerId && event instanceof type && fn(event));
    }

    public filter(type: any): Event[] {
        return this.log.filter((event) => event instanceof type);
    }

    public lastOf(fn: (event: Event) => boolean): Event | null {
        for (let i = this.log.length - 1; i >= 0; --i) {
            if (fn(this.log[i])) {
                return this.log[i];
            }
        }
        return null;
    }

    public lastInstanceOf(type: any, fn: (event: Event) => boolean = () => true): Event | null {
        return this.lastOf((event: Event) => event instanceof type && fn(event));
    }

    public lastOfTwo(playerId: PlayerId, type1: any, type2: any): Event | null {
        return this.lastOf(
            (event: Event) => event.playerId === playerId && (event instanceof type1 || event instanceof type2),
        );
    }
}

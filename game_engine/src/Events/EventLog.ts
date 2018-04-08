import * as _ from "ramda";
import { v4 } from "uuid";
import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class EventLog {
    constructor(public log: Event[] = []) {}

    public add(event: Event): this {
        event.id = v4();
        event.type = event.constructor.name.toString();
        this.log.push(event);
        return this;
    }

    public addIfNew(event: Event): this {
        if (_.contains(event, this.log)) {
            return this;
        }
        return this.add(event);
    }

    public filterBy(playerId: PlayerId, type: any, fn: (event: Event) => boolean = () => true): Event[] {
        // console.log(`Events processed by filterBy ${this.log.length}`);
        return this.log.filter((event) => event.playerId === playerId && event instanceof type && fn(event));
    }

    public filter(type: any): Event[] {
        // console.log(`Events processed by filterBy ${this.log.length}`);
        return this.log.filter((event) => event instanceof type);
    }

    public lastOf(fn: (event: Event) => boolean): Event | null {
        for (let i = this.log.length - 1; i >= 0; --i) {
            if (fn(this.log[i])) {
                // console.log(`Events processed by lastOf ${i}`)
                return this.log[i];
            }
        }
        // console.log(`Events processed by lastOf ${this.log.length}`)
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

import * as _ from "ramda";
import { v4 } from "uuid";
import { PlayerId } from "../PlayerId";
import { UUID } from "../UUID";
import { Event } from "./Event";

export class EventLog {
    private static hashArgs(xs: any): string|null {
        let hash = "";
        for (const x of Array.from(xs)) {
            if (typeof x === "object") {
                return null;
            }
            hash += x.toString();
        }
        return hash;
    }

    constructor(public log: Event[] = [], private cache: Map<string, any> = new Map<string, any>()) {}

    public add(event: Event): this {
        event.id = v4();
        event.type = event.constructor.name.toString();
        this.log.push(event);

        this.cache.clear();
        return this;
    }

    public addIfNew(event: Event): this {
        if (_.contains(event, this.log)) {
            return this;
        }
        return this.add(event);
    }

    public filterBy(playerId: PlayerId, type: any, fn: (event: Event) => boolean = () => true): Event[] {
        const hash = EventLog.hashArgs(arguments);
        if (hash !== null && this.cache.has(hash)) {
            return this.cache.get(hash);
        }
        // console.log(`Events processed by filterBy ${this.log.length}`);
        const events = this.log.filter((event) => event.playerId === playerId && event instanceof type && fn(event));
        this.cache.set(hash, events);
        return events;
    }

    public filter(type: any): Event[] {
        const hash = EventLog.hashArgs(arguments);
        if (hash !== null && this.cache.has(hash)) {
            return this.cache.get(hash);
        }

        // console.log(`Events processed by filterBy ${this.log.length}`);
        const events = this.log.filter((event) => event instanceof type);
        this.cache.set(hash, events);
        return events;
    }

    public lastInstanceOf(type: any, fn: (event: Event) => boolean = () => true): Event | null {
        const hash = EventLog.hashArgs(arguments);
        if (hash !== null && this.cache.has(hash)) {
            return this.cache.get(hash);
        }

        const lastOf = this.lastOf((event: Event) => event instanceof type && fn(event));
        this.cache.set(hash, lastOf);
        return lastOf;
    }

    public lastOfTwo(playerId: PlayerId, type1: any, type2: any): Event | null {
        const hash = EventLog.hashArgs(arguments);
        if (hash !== null && this.cache.has(hash)) {
            return this.cache.get(hash);
        }

        const lastOf = this.lastOf(
            (event: Event) => event.playerId === playerId && (event instanceof type1 || event instanceof type2),
        );
        this.cache.set(hash, lastOf);
        return lastOf;
    }

    public resetUntilEvent(id: UUID) {
        let index = 0;
        for (const event of this.log) {
            if (event.id === id) {
                break;
            }
            index += 1;
        }
        if (index === this.log.length - 1) {
            return this;
        }

        this.log = this.log.splice(0, index + 1);
        return this;
    }

    private lastOf(fn: (event: Event) => boolean): Event | null {
        for (let i = this.log.length - 1; i >= 0; --i) {
            if (fn(this.log[i])) {
                // console.log(`Events processed by lastOf ${i}`);
                return this.log[i];
            }
        }
        // console.log(`Events processed by lastOf ${this.log.length}`);
        return null;
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("ramda");
const uuid_1 = require("uuid");
class EventLog {
    constructor(log = [], cache = new Map()) {
        this.log = log;
        this.cache = cache;
    }
    static hashArgs(xs) {
        let hash = "";
        for (const x of Array.from(xs)) {
            if (typeof x === "object") {
                return null;
            }
            hash += x.toString();
        }
        return hash;
    }
    add(event) {
        event.id = uuid_1.v4();
        event.type = event.constructor.name.toString();
        this.log.push(event);
        this.cache.clear();
        return this;
    }
    addIfNew(event) {
        if (_.contains(event, this.log)) {
            return this;
        }
        return this.add(event);
    }
    filterBy(playerId, type, fn = () => true) {
        const hash = EventLog.hashArgs(arguments);
        if (hash !== null && this.cache.has(hash)) {
            return this.cache.get(hash);
        }
        // console.log(`Events processed by filterBy ${this.log.length}`);
        const events = this.log.filter((event) => event.playerId === playerId && event instanceof type && fn(event));
        this.cache.set(hash, events);
        return events;
    }
    filter(type) {
        const hash = EventLog.hashArgs(arguments);
        if (hash !== null && this.cache.has(hash)) {
            return this.cache.get(hash);
        }
        // console.log(`Events processed by filterBy ${this.log.length}`);
        const events = this.log.filter((event) => event instanceof type);
        this.cache.set(hash, events);
        return events;
    }
    lastInstanceOf(type, fn = () => true) {
        const hash = EventLog.hashArgs(arguments);
        if (hash !== null && this.cache.has(hash)) {
            return this.cache.get(hash);
        }
        const lastOf = this.lastOf((event) => event instanceof type && fn(event));
        this.cache.set(hash, lastOf);
        return lastOf;
    }
    lastOfTwo(playerId, type1, type2) {
        const hash = EventLog.hashArgs(arguments);
        if (hash !== null && this.cache.has(hash)) {
            return this.cache.get(hash);
        }
        const lastOf = this.lastOf((event) => event.playerId === playerId && (event instanceof type1 || event instanceof type2));
        this.cache.set(hash, lastOf);
        return lastOf;
    }
    lastOf(fn) {
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
exports.EventLog = EventLog;

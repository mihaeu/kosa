"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("ramda");
class EventLog {
    constructor() {
        this.log = [];
    }
    add(event) {
        this.log.push(event);
        return this;
    }
    addIfNew(event) {
        if (_.contains(event, this.log)) {
            return this;
        }
        return this.add(event);
    }
    filterBy(playerId, type, fn = () => true) {
        // console.log(`Events processed by filterBy ${this.log.length}`);
        return this.log.filter((event) => event.playerId === playerId && event instanceof type && fn(event));
    }
    filter(type) {
        // console.log(`Events processed by filterBy ${this.log.length}`);
        return this.log.filter((event) => event instanceof type);
    }
    lastOf(fn) {
        for (let i = this.log.length - 1; i >= 0; --i) {
            if (fn(this.log[i])) {
                // console.log(`Events processed by lastOf ${i}`)
                return this.log[i];
            }
        }
        // console.log(`Events processed by lastOf ${this.log.length}`)
        return null;
    }
    lastInstanceOf(type, fn = () => true) {
        return this.lastOf((event) => event instanceof type && fn(event));
    }
    lastOfTwo(playerId, type1, type2) {
        return this.lastOf((event) => event.playerId === playerId && (event instanceof type1 || event instanceof type2));
    }
}
exports.EventLog = EventLog;

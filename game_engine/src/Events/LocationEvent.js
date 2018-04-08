"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class LocationEvent extends Event_1.Event {
    constructor(playerId, unit, destination) {
        super(playerId);
        this.playerId = playerId;
        this.unit = unit;
        this.destination = destination;
    }
}
exports.LocationEvent = LocationEvent;

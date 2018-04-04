"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocationEvent_1 = require("./LocationEvent");
class MoveEvent extends LocationEvent_1.LocationEvent {
    constructor(playerId, unit, destination, resources = []) {
        super(playerId, unit, destination);
        this.playerId = playerId;
        this.unit = unit;
        this.destination = destination;
        this.resources = resources;
    }
}
exports.MoveEvent = MoveEvent;

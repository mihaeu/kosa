"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class BuildEvent extends Event_1.Event {
    constructor(playerId, location, building) {
        super(playerId);
        this.playerId = playerId;
        this.location = location;
        this.building = building;
    }
}
exports.BuildEvent = BuildEvent;

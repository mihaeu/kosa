"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class ResourceEvent extends Event_1.Event {
    constructor(playerId, resources) {
        super(playerId);
        this.playerId = playerId;
        this.resources = resources;
    }
}
exports.ResourceEvent = ResourceEvent;

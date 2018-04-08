"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class StarEvent extends Event_1.Event {
    constructor(playerId, star) {
        super(playerId);
        this.playerId = playerId;
        this.star = star;
    }
}
exports.StarEvent = StarEvent;

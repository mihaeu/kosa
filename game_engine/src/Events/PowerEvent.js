"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class PowerEvent extends Event_1.Event {
    constructor(playerId, power) {
        super(playerId);
        this.playerId = playerId;
        this.power = power;
    }
}
exports.PowerEvent = PowerEvent;

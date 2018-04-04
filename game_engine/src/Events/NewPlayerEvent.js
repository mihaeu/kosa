"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class NewPlayerEvent extends Event_1.Event {
    constructor(playerId, player) {
        super(playerId);
        this.playerId = playerId;
        this.player = player;
    }
}
exports.NewPlayerEvent = NewPlayerEvent;

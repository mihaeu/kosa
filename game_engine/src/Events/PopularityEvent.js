"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class PopularityEvent extends Event_1.Event {
    constructor(playerId, popularity) {
        super(playerId);
        this.playerId = playerId;
        this.popularity = popularity;
    }
}
exports.PopularityEvent = PopularityEvent;

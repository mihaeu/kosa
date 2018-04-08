"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class EnlistEvent extends Event_1.Event {
    constructor(playerId, recruitReward, bottomAction) {
        super(playerId);
        this.playerId = playerId;
        this.recruitReward = recruitReward;
        this.bottomAction = bottomAction;
    }
}
exports.EnlistEvent = EnlistEvent;

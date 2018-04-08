"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class UpgradeEvent extends Event_1.Event {
    constructor(playerId, topAction, bottomAction) {
        super(playerId);
        this.playerId = playerId;
        this.topAction = topAction;
        this.bottomAction = bottomAction;
    }
}
exports.UpgradeEvent = UpgradeEvent;

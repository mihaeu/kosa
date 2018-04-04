"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpgradeEvent {
    constructor(playerId, topAction, bottomAction) {
        this.playerId = playerId;
        this.topAction = topAction;
        this.bottomAction = bottomAction;
    }
}
exports.UpgradeEvent = UpgradeEvent;

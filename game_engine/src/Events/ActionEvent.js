"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class ActionEvent extends Event_1.Event {
    constructor(playerId, action) {
        super(playerId);
        this.playerId = playerId;
        this.action = action;
    }
}
exports.ActionEvent = ActionEvent;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class GainCombatCardEvent extends Event_1.Event {
    constructor(playerId, combatCard) {
        super(playerId);
        this.playerId = playerId;
        this.combatCard = combatCard;
    }
}
exports.GainCombatCardEvent = GainCombatCardEvent;

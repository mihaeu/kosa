"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class CoinEvent extends Event_1.Event {
    constructor(playerId, coins) {
        super(playerId);
        this.playerId = playerId;
        this.coins = coins;
    }
}
exports.CoinEvent = CoinEvent;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Faction_1 = require("./Faction");
class Player {
    constructor(playerId, faction, playerMat, setupEvents = []) {
        this.playerId = playerId;
        this.faction = faction;
        this.playerMat = playerMat;
        this.setupEvents = setupEvents;
    }
}
Player.FACTION_TURN_ORDER = [
    Faction_1.Faction.GREEN,
    Faction_1.Faction.BLUE,
    Faction_1.Faction.RED,
    Faction_1.Faction.PURPLE,
    Faction_1.Faction.YELLOW,
    Faction_1.Faction.BLACK,
    Faction_1.Faction.WHITE,
];
exports.Player = Player;

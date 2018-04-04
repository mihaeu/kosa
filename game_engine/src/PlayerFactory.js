"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CombatCard_1 = require("./CombatCard");
const CombatCardEvent_1 = require("./Events/CombatCardEvent");
const DeployEvent_1 = require("./Events/DeployEvent");
const PowerEvent_1 = require("./Events/PowerEvent");
const Faction_1 = require("./Faction");
const Field_1 = require("./Field");
const Player_1 = require("./Player");
const Character_1 = require("./Units/Character");
const Worker_1 = require("./Units/Worker");
class PlayerFactory {
    static black(playerId, playerMat) {
        return new Player_1.Player(playerId, Faction_1.Faction.BLACK, playerMat, [
            new DeployEvent_1.DeployEvent(playerId, Character_1.Character.CHARACTER, Field_1.Field.black),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_1, Field_1.Field.m6),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_2, Field_1.Field.t8),
            new PowerEvent_1.PowerEvent(playerId, 1),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
        ]);
    }
    static red(playerId, playerMat) {
        return new Player_1.Player(playerId, Faction_1.Faction.RED, playerMat, [
            new DeployEvent_1.DeployEvent(playerId, Character_1.Character.CHARACTER, Field_1.Field.red),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_1, Field_1.Field.v3),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_2, Field_1.Field.m5),
            new PowerEvent_1.PowerEvent(playerId, 3),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
        ]);
    }
    static blue(playerId, playerMat) {
        return new Player_1.Player(playerId, Faction_1.Faction.BLUE, playerMat, [
            new DeployEvent_1.DeployEvent(playerId, Character_1.Character.CHARACTER, Field_1.Field.blue),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_1, Field_1.Field.w1),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_2, Field_1.Field.t1),
            new PowerEvent_1.PowerEvent(playerId, 4),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
        ]);
    }
    static yellow(playerId, playerMat) {
        return new Player_1.Player(playerId, Faction_1.Faction.YELLOW, playerMat, [
            new DeployEvent_1.DeployEvent(playerId, Character_1.Character.CHARACTER, Field_1.Field.yellow),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_1, Field_1.Field.f6),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_2, Field_1.Field.v9),
            new PowerEvent_1.PowerEvent(playerId, 5),
        ]);
    }
    static white(playerId, playerMat) {
        return new Player_1.Player(playerId, Faction_1.Faction.WHITE, playerMat, [
            new DeployEvent_1.DeployEvent(playerId, Character_1.Character.CHARACTER, Field_1.Field.white),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_1, Field_1.Field.w2),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_2, Field_1.Field.f4),
            new PowerEvent_1.PowerEvent(playerId, 2),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
        ]);
    }
    static purple(playerId, playerMat) {
        return new Player_1.Player(playerId, Faction_1.Faction.PURPLE, playerMat, [
            new DeployEvent_1.DeployEvent(playerId, Character_1.Character.CHARACTER, Field_1.Field.purple),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_1, Field_1.Field.t7),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_2, Field_1.Field.f7),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
            new CombatCardEvent_1.GainCombatCardEvent(playerId, new CombatCard_1.CombatCard()),
        ]);
    }
    static green(playerId, playerMat) {
        return new Player_1.Player(playerId, Faction_1.Faction.GREEN, playerMat, [
            new DeployEvent_1.DeployEvent(playerId, Character_1.Character.CHARACTER, Field_1.Field.green),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_1, Field_1.Field.m1),
            new DeployEvent_1.DeployEvent(playerId, Worker_1.Worker.WORKER_2, Field_1.Field.f1),
            new PowerEvent_1.PowerEvent(playerId, 3),
        ]);
    }
}
exports.PlayerFactory = PlayerFactory;

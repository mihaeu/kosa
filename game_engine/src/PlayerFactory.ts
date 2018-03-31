import { CombatCard } from "./CombatCard";
import { GainCombatCardEvent } from "./Events/CombatCardEvent";
import { DeployEvent } from "./Events/DeployEvent";
import { PowerEvent } from "./Events/PowerEvent";
import { Faction } from "./Faction";
import { Field } from "./Field";
import { Player } from "./Player";
import { PlayerId } from "./PlayerId";
import { PlayerMat } from "./PlayerMat";
import { Character } from "./Units/Character";
import { Worker } from "./Units/Worker";

export class PlayerFactory {
    public static black(playerId: PlayerId, playerMat: PlayerMat): Player {
        return new Player(playerId, Faction.BLACK, playerMat, [
            new DeployEvent(playerId, Character.CHARACTER, Field.black),
            new DeployEvent(playerId, Worker.WORKER_1, Field.m6),
            new DeployEvent(playerId, Worker.WORKER_2, Field.t8),
            new PowerEvent(playerId, 1),
            new GainCombatCardEvent(playerId, new CombatCard()),
            new GainCombatCardEvent(playerId, new CombatCard()),
            new GainCombatCardEvent(playerId, new CombatCard()),
            new GainCombatCardEvent(playerId, new CombatCard()),
        ]);
    }

    public static red(playerId: PlayerId, playerMat: PlayerMat): Player {
        return new Player(playerId, Faction.RED, playerMat, [
            new DeployEvent(playerId, Character.CHARACTER, Field.red),
            new DeployEvent(playerId, Worker.WORKER_1, Field.v3),
            new DeployEvent(playerId, Worker.WORKER_2, Field.m5),
            new PowerEvent(playerId, 3),
            new GainCombatCardEvent(playerId, new CombatCard()),
            new GainCombatCardEvent(playerId, new CombatCard()),
        ]);
    }

    public static blue(playerId: PlayerId, playerMat: PlayerMat): Player {
        return new Player(playerId, Faction.BLUE, playerMat, [
            new DeployEvent(playerId, Character.CHARACTER, Field.blue),
            new DeployEvent(playerId, Worker.WORKER_1, Field.w1),
            new DeployEvent(playerId, Worker.WORKER_2, Field.t1),
            new PowerEvent(playerId, 4),
            new GainCombatCardEvent(playerId, new CombatCard()),
        ]);
    }

    public static yellow(playerId: PlayerId, playerMat: PlayerMat): Player {
        return new Player(playerId, Faction.YELLOW, playerMat, [
            new DeployEvent(playerId, Character.CHARACTER, Field.yellow),
            new DeployEvent(playerId, Worker.WORKER_1, Field.f6),
            new DeployEvent(playerId, Worker.WORKER_2, Field.v9),
            new PowerEvent(playerId, 5),
        ]);
    }

    public static white(playerId: PlayerId, playerMat: PlayerMat): Player {
        return new Player(playerId, Faction.WHITE, playerMat, [
            new DeployEvent(playerId, Character.CHARACTER, Field.white),
            new DeployEvent(playerId, Worker.WORKER_1, Field.w2),
            new DeployEvent(playerId, Worker.WORKER_2, Field.f4),
            new PowerEvent(playerId, 2),
            new GainCombatCardEvent(playerId, new CombatCard()),
            new GainCombatCardEvent(playerId, new CombatCard()),
            new GainCombatCardEvent(playerId, new CombatCard()),
        ]);
    }

    public static purple(playerId: PlayerId, playerMat: PlayerMat): Player {
        return new Player(playerId, Faction.PURPLE, playerMat, [
            new DeployEvent(playerId, Character.CHARACTER, Field.purple),
            new DeployEvent(playerId, Worker.WORKER_1, Field.t7),
            new DeployEvent(playerId, Worker.WORKER_2, Field.f7),
            new GainCombatCardEvent(playerId, new CombatCard()),
            new GainCombatCardEvent(playerId, new CombatCard()),
        ]);
    }

    public static green(playerId: PlayerId, playerMat: PlayerMat): Player {
        return new Player(playerId, Faction.GREEN, playerMat, [
            new DeployEvent(playerId, Character.CHARACTER, Field.green),
            new DeployEvent(playerId, Worker.WORKER_1, Field.m1),
            new DeployEvent(playerId, Worker.WORKER_2, Field.f1),
            new PowerEvent(playerId, 3),
        ]);
    }
}

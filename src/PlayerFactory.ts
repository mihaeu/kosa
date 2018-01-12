import {Faction} from "./Faction";
import {Player} from "./Player";
import {PlayerMat} from "./PlayerMat";
import {GainCombatCardEvent} from "./Events/CombatCardEvent";
import {EventLog} from "./Events/EventLog";
import {PowerEvent} from "./Events/PowerEvent";
import {CombatCard} from "./CombatCard";

export class PlayerFactory {
    public static black(playerMat: PlayerMat): Player {
        const log = new EventLog()
            .add(new PowerEvent(1))
            .add(new GainCombatCardEvent(new CombatCard))
            .add(new GainCombatCardEvent(new CombatCard))
            .add(new GainCombatCardEvent(new CombatCard))
            .add(new GainCombatCardEvent(new CombatCard));
        return new Player(log, Faction.BLACK, playerMat);
    }

    public static red(playerMat: PlayerMat): Player {
        const log = new EventLog()
            .add(new PowerEvent(3))
            .add(new GainCombatCardEvent(new CombatCard))
            .add(new GainCombatCardEvent(new CombatCard));
        return new Player(log, Faction.RED, playerMat);
    }

    public static blue(playerMat: PlayerMat): Player {
        const log = new EventLog()
            .add(new PowerEvent(4))
            .add(new GainCombatCardEvent(new CombatCard));
        return new Player(log, Faction.BLUE, playerMat);
    }

    public static yellow(playerMat: PlayerMat): Player {
        const log = new EventLog()
            .add(new PowerEvent(5));
        return new Player(log, Faction.YELLOW, playerMat);
    }

    public static white(playerMat: PlayerMat): Player {
        const log = new EventLog()
            .add(new PowerEvent(2))
            .add(new GainCombatCardEvent(new CombatCard))
            .add(new GainCombatCardEvent(new CombatCard))
            .add(new GainCombatCardEvent(new CombatCard));
        return new Player(log, Faction.WHITE, playerMat);
    }

    public static purple(playerMat: PlayerMat): Player {
        const log = new EventLog()
            .add(new GainCombatCardEvent(new CombatCard))
            .add(new GainCombatCardEvent(new CombatCard));
        return new Player(log, Faction.PURPLE, playerMat);
    }

    public static green(playerMat: PlayerMat): Player {
        const log = new EventLog()
            .add(new PowerEvent(3));
        return new Player(log, Faction.GREEN, playerMat);
    }
}
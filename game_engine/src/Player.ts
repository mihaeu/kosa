import {Faction} from "./Faction";
import {PlayerMat} from "./PlayerMat";
import {PlayerId} from "./PlayerId";
import {Event} from "./Events/Event";

export class Player {
    public static readonly FACTION_TURN_ORDER = [
        Faction.GREEN,
        Faction.BLUE,
        Faction.RED,
        Faction.PURPLE,
        Faction.YELLOW,
        Faction.BLACK,
        Faction.WHITE,
    ];

    constructor(
        public readonly playerId: PlayerId,
        public readonly faction: Faction,
        public readonly playerMat: PlayerMat,
        public readonly setupEvents: Event[] = [],
    ) {}
}
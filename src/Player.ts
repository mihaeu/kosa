import {Faction} from "./Faction";
import {PlayerMat} from "./PlayerMat";
import {PlayerId} from "./PlayerId";
import {Event} from "./Events/Event";

export class Player {
    constructor(
        public readonly playerId: PlayerId,
        public readonly faction: Faction,
        public readonly playerMat: PlayerMat,
        public readonly setupEvents: Event[] = [],
    ) {}
}
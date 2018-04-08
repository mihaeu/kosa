import { CombatCard } from "../CombatCard";
import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class GainCombatCardEvent extends Event {
    constructor(public readonly playerId: PlayerId, public readonly combatCard: CombatCard) {
        super(playerId);
    }
}

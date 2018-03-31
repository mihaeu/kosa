import {CombatCard} from "../CombatCard";
import {PlayerId} from "../PlayerId";
import {Event} from "./Event";

export class GainCombatCardEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly combatCard: CombatCard) {}
}

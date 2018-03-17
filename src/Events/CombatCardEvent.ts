import {Event} from "./Event";
import {CombatCard} from "../CombatCard";
import {PlayerId} from "../PlayerId";

export class GainCombatCardEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly combatCard: CombatCard) {}
}

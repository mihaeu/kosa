import {Event} from "./Event";
import {CombatCard} from "../CombatCard";

export class GainCombatCardEvent implements Event {
    constructor(public readonly combatCard: CombatCard) {}
}

import {Event} from "./Event";
import {CombatCard} from "../CombatCard";

export class CombatCardEvent implements Event {
    constructor(public readonly combatCard: CombatCard) {}
}

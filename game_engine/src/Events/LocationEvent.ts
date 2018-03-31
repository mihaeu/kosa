import {Field} from "../Field";
import {PlayerId} from "../PlayerId";
import {Unit} from "../Units/Unit";
import {Event} from "./Event";

export class LocationEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly unit: Unit, public readonly destination: Field) {}
}

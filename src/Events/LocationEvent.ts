import {Event} from "./Event";
import {Unit} from "../Units/Unit";
import {Field} from "../Field";
import {PlayerId} from "../PlayerId";

export class LocationEvent implements Event {
    constructor(
        public readonly playerId: PlayerId,
        public readonly unit: Unit,
        public readonly destination: Field,
    ) {}
}
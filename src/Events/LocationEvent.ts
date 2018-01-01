import {Event} from "./Event";
import {Unit} from "../Units/Unit";
import {Field} from "../Field";

export class LocationEvent implements Event {
    constructor(
        public readonly unit: Unit,
        public readonly destination: Field,
    ) {}
}
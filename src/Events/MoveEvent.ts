import {Field} from "../Field";
import {Resource} from "../Resource";
import {Unit} from "../Units/Unit";
import {LocationEvent} from "./LocationEvent";

export class MoveEvent extends LocationEvent {
    constructor(
        public readonly unit: Unit,
        public readonly destination: Field,
        public readonly resources: Resource[] = []
    ) {
        super(unit, destination);
    }
}

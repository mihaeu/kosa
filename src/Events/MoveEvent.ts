import {Field} from "../Field";
import {ResourceType} from "../ResourceType";
import {Unit} from "../Units/Unit";
import {LocationEvent} from "./LocationEvent";

export class MoveEvent extends LocationEvent {
    constructor(
        public readonly unit: Unit,
        public readonly destination: Field,
        public readonly resources: ResourceType[] = []
    ) {
        super(unit, destination);
    }
}

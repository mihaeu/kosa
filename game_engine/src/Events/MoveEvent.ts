import { Field } from "../Field";
import { PlayerId } from "../PlayerId";
import { ResourceType } from "../ResourceType";
import { Unit } from "../Units/Unit";
import { LocationEvent } from "./LocationEvent";

export class MoveEvent extends LocationEvent {
    constructor(
        public readonly playerId: PlayerId,
        public readonly unit: Unit,
        public readonly destination: Field,
        public readonly resources: ResourceType[] = [],
    ) {
        super(playerId, unit, destination);
    }
}

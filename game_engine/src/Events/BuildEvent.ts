import {BuildingType} from "../BuildingType";
import {Field} from "../Field";
import {PlayerId} from "../PlayerId";
import {Event} from "./Event";

export class BuildEvent implements Event {
    constructor(
        public readonly playerId: PlayerId,
        public readonly location: Field,
        public readonly building: BuildingType,
    ) {}
}

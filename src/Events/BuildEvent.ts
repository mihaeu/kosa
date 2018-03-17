import {BuildingType} from "../BuildingType";
import {Field} from "../Field";
import {Event} from "./Event";
import {PlayerId} from "../PlayerId";

export class BuildEvent implements Event {
    constructor(
        public readonly playerId: PlayerId,
        public readonly location: Field,
        public readonly building: BuildingType,
    ) {}
}
import {Field} from "./Field";
import {BuildingType} from "./BuildingType";
import {BuildEvent} from "./Events/BuildEvent";

export class Building {
    public constructor(public readonly building: BuildingType, public readonly location: Field) {}

    public static fromEvent(event: BuildEvent) {
        return new Building(event.building, event.location);
    }
}
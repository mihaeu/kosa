import {BuildingType} from "./BuildingType";
import {BuildEvent} from "./Events/BuildEvent";
import {Field} from "./Field";

export class Building {
    public static fromEvent(event: BuildEvent) {
        return new Building(event.building, event.location);
    }

    public constructor(public readonly building: BuildingType, public readonly location: Field) {}
}

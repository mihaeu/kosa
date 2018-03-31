import { Field } from "./Field";

export class LocationAlreadyHasAnotherBuildingError extends Error {
    constructor(location: Field) {
        super(`${location} already has another building.`);
    }
}

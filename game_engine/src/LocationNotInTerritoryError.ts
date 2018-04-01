import { Field } from "./Field";

export class LocationNotInTerritoryError extends Error {
    constructor(location: Field, territory: Field[]) {
        super(`${location} is not part of your territory ${territory.join(", ")}.`);
    }
}

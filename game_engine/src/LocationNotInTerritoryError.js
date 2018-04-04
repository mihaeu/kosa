"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LocationNotInTerritoryError extends Error {
    constructor(location, territory) {
        super(`${location} is not part of your territory ${territory.join(", ")}.`);
    }
}
exports.LocationNotInTerritoryError = LocationNotInTerritoryError;

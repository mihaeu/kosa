"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LocationAlreadyHasAnotherBuildingError extends Error {
    constructor(location) {
        super(`${location} already has another building.`);
    }
}
exports.LocationAlreadyHasAnotherBuildingError = LocationAlreadyHasAnotherBuildingError;

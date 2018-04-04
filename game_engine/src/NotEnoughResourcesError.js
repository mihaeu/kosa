"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotEnoughResourcesError extends Error {
    constructor(type, count, availableResources) {
        super(`Not enough resources of type ${type}; ${count} required, but only ${availableResources} available.`);
    }
}
exports.NotEnoughResourcesError = NotEnoughResourcesError;

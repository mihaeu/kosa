"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProvidedResourcesNotAvailableError extends Error {
    constructor(providedResources, availableResources) {
        super("The provided resources (" +
            providedResources.join(", ") +
            ") are not among your available resources (" +
            availableResources.join(", ") +
            ").");
    }
}
exports.ProvidedResourcesNotAvailableError = ProvidedResourcesNotAvailableError;

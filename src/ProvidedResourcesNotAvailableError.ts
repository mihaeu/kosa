import {Resource} from "./Resource";

export class ProvidedResourcesNotAvailableError extends Error {
    constructor(availableResources: Resource[], requiredResources: Resource[]) {
        super(`The provided resources (${availableResources.join(", ")}) are not among your available resources (${requiredResources.join(", ")}).`);
    }
}

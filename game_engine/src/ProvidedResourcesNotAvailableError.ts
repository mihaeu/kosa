import { Resource } from "./Resource";

export class ProvidedResourcesNotAvailableError extends Error {
    constructor(providedResources: Resource[], availableResources: Resource[]) {
        super(
            "The provided resources (" +
                providedResources.join(", ") +
                ") are not among your available resources (" +
                availableResources.join(", ") +
                ").",
        );
    }
}

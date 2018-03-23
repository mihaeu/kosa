import {ResourceType} from "./ResourceType";

export class NotEnoughResourcesError extends Error {
    constructor(type: ResourceType, count: number, availableResources: number) {
        super(`Not enough resources of type ${type}; ${count} required, but only ${availableResources} available.`);
    }
}

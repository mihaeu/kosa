import {ResourceType} from "./ResourceType";

export class ResourceCost {
    constructor(public readonly resourceType: ResourceType, public readonly count: number) {}
}

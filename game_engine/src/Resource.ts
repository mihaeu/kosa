import {Field} from "./Field";
import {ResourceType} from "./ResourceType";

export class Resource {
    constructor(
        public readonly location: Field,
        public readonly type: ResourceType
    ) {}

    public toString(): String {
        return `${this.location.toString()}:${this.type}`;
    }
}
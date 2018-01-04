import {Event} from "./Event";
import {Resource} from "../Resource";

export class ResourceEvent implements Event {
    constructor(
        public readonly resources: Resource[],
    ) {}
}
import {Field} from "../Field";
import {Resource} from "../Resource";
import {Event} from "./Event";

export class ResourceEvent implements Event {
    constructor(
        public readonly location: Field,
        public readonly resource: Resource,
        public readonly count: number = 1
    ) {}
}
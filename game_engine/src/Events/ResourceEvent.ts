import {Event} from "./Event";
import {Resource} from "../Resource";
import {PlayerId} from "../PlayerId";

export class ResourceEvent implements Event {
    constructor(
        public readonly playerId: PlayerId,
        public readonly resources: Resource[],
    ) {}
}
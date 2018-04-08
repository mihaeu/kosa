import { PlayerId } from "../PlayerId";
import { Resource } from "../Resource";
import { Event } from "./Event";

export class ResourceEvent extends Event {
    constructor(public readonly playerId: PlayerId, public readonly resources: Resource[]) {
        super(playerId);
    }
}

import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class PopularityEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly popularity: number) {}
}

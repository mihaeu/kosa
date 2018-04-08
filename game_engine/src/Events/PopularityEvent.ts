import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class PopularityEvent extends Event {
    constructor(public readonly playerId: PlayerId, public readonly popularity: number) {
        super(playerId);
    }
}

import {Event} from "./Event";
import {PlayerId} from "../PlayerId";

export class PopularityEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly popularity: number) {}
}

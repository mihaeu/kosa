import { PlayerId } from "../PlayerId";
import { Star } from "../Star";
import { Event } from "./Event";

export class StarEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly star: Star) {}
}

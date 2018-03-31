import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class PowerEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly power: number) {}
}

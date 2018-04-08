import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class PowerEvent extends Event {
    constructor(public readonly playerId: PlayerId, public readonly power: number) {
        super(playerId);
    }
}

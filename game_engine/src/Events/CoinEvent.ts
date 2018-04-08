import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class CoinEvent extends Event {
    constructor(public readonly playerId: PlayerId, public readonly coins: number) {
        super(playerId);
    }
}

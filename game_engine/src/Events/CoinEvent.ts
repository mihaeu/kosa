import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class CoinEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly coins: number) {}
}

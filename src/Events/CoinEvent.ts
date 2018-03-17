import {Event} from "./Event";
import {PlayerId} from "../PlayerId";

export class CoinEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly coins: number) {}
}

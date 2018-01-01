import {Event} from "./Event";

export class CoinEvent implements Event {
    constructor(public readonly coins: number) {}
}

import {Event} from "./Event";
import {PlayerId} from "../PlayerId";

export class PowerEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly power: number) {}
}
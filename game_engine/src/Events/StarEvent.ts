import {Event} from "./Event";
import {PlayerId} from "../PlayerId";
import {Star} from "../Star";

export class StarEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly star: Star) {}
}
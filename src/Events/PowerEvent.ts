import {Event} from "./Event";

export class PowerEvent implements Event {
    constructor(public readonly power: number) {}
}
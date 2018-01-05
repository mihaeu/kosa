import {Event} from "./Event";

export class PopularityEvent implements Event {
    constructor(public readonly popularity: number) {}
}

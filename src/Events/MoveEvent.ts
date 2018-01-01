import {Field} from "../Field";
import {Resource} from "../Resource";
import {Unit} from "../Units/Unit";
import {Event} from "./Event";

export class MoveEvent implements Event {
    constructor(
        public readonly unit: Unit,
        public readonly destination: Field,
        public readonly resources: Resource[] = []
    ) {}
}

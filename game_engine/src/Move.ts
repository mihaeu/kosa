import { Field } from "./Field";
import { Unit } from "./Units/Unit";

export class Move {
    constructor(public readonly unit: Unit, public readonly destination: Field) {}
}

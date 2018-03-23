import {Field} from "./Field";
import {Unit} from "./Units/Unit";

export class IllegalMoveError extends Error {
    constructor(unit: Unit, start: Field, end: Field) {
        super(`${unit} is not allowed to move from ${start} to ${end}.`);
    }
}

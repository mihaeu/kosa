import { Move } from "../Move";
import { Option } from "./Option";

export class MoveOption extends Option {
    constructor(public readonly moves: Move[]) {
        super();
    }
}

import { Field } from "../Field";
import { Option } from "./Option";

export class ProduceOption extends Option {
    constructor(public readonly locations: Field[]) {
        super("ProduceOption");
    }
}

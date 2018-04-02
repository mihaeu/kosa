import { Field } from "../Field";
import { Mech } from "../Units/Mech";
import { Option } from "./Option";

export class DeployOption extends Option {
    constructor(public readonly location: Field, public readonly mech: Mech) {
        super();
    }
}

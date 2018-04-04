import { Mech } from "../Units/Mech";
import { Worker } from "../Units/Worker";
import { Option } from "./Option";

export class DeployOption extends Option {
    constructor(public readonly worker: Worker, public readonly mech: Mech) {
        super();
    }
}

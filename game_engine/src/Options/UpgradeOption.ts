import { Upgrade } from "../Upgrade";
import { Option } from "./Option";

export class UpgradeOption extends Option {
    constructor(public readonly upgrade: Upgrade) {
        super();
    }
}

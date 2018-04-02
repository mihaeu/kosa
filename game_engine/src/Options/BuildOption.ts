import { Building } from "../Building";
import { Option } from "./Option";

export class BuildOption extends Option {
    constructor(public readonly building: Building) {
        super();
    }
}

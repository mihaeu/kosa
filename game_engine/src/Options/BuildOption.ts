import { BuildingType } from "../BuildingType";
import { Worker } from "../Units/Worker";
import { Option } from "./Option";

export class BuildOption extends Option {
    constructor(public readonly worker: Worker, public readonly buildingType: BuildingType) {
        super();
    }
}

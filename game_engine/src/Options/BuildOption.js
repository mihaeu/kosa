"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class BuildOption extends Option_1.Option {
    constructor(worker, buildingType) {
        super("BuildOption");
        this.worker = worker;
        this.buildingType = buildingType;
    }
}
exports.BuildOption = BuildOption;

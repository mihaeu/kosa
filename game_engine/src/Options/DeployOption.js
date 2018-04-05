"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class DeployOption extends Option_1.Option {
    constructor(worker, mech) {
        super("DeployOption");
        this.worker = worker;
        this.mech = mech;
    }
}
exports.DeployOption = DeployOption;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class UpgradeOption extends Option_1.Option {
    constructor(upgrade) {
        super("UpgradeOption");
        this.upgrade = upgrade;
    }
}
exports.UpgradeOption = UpgradeOption;

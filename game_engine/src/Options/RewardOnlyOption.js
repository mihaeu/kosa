"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class RewardOnlyOption extends Option_1.Option {
    constructor(bottomAction) {
        super("ProduceOption");
        this.bottomAction = bottomAction;
    }
}
exports.RewardOnlyOption = RewardOnlyOption;

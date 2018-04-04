"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class EnlistOption extends Option_1.Option {
    constructor(reward, bottomAction) {
        super();
        this.reward = reward;
        this.bottomAction = bottomAction;
    }
}
exports.EnlistOption = EnlistOption;

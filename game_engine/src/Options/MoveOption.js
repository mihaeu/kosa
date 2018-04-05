"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class MoveOption extends Option_1.Option {
    constructor(moves) {
        super("MoveOption");
        this.moves = moves;
    }
}
exports.MoveOption = MoveOption;

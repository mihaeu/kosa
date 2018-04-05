"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class ProduceOption extends Option_1.Option {
    constructor(locations) {
        super("ProduceOption");
        this.locations = locations;
    }
}
exports.ProduceOption = ProduceOption;

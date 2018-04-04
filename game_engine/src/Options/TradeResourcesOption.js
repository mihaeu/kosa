"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class TradeResourcesOption extends Option_1.Option {
    constructor(resource1, resource2) {
        super();
        this.resource1 = resource1;
        this.resource2 = resource2;
    }
}
exports.TradeResourcesOption = TradeResourcesOption;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceType_1 = require("./ResourceType");
class Resources {
    constructor(metal = 0, food = 0, oil = 0, wood = 0) {
        this.metal = metal;
        this.food = food;
        this.oil = oil;
        this.wood = wood;
    }
    countByType(type) {
        switch (type) {
            case ResourceType_1.ResourceType.METAL:
                return this.metal;
            case ResourceType_1.ResourceType.FOOD:
                return this.food;
            case ResourceType_1.ResourceType.OIL:
                return this.oil;
            case ResourceType_1.ResourceType.WOOD:
                return this.wood;
        }
    }
}
exports.Resources = Resources;

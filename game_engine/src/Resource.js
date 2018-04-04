"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Resource {
    constructor(location, type) {
        this.location = location;
        this.type = type;
    }
    toString() {
        return `${this.location.toString()}:${this.type}`;
    }
}
exports.Resource = Resource;

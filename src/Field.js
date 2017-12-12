"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Field {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.connectedFields = [];
    }
    connectField(field, connection) {
        this.connectedFields.push({ field: field, connection: connection });
    }
    getConnectedFields() {
        return this.connectedFields;
    }
}
exports.Field = Field;

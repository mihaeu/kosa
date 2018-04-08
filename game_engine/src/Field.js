"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FieldName_1 = require("./FieldName");
const FieldType_1 = require("./FieldType");
class Field {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.name = name;
        this.type = type;
    }
    static isNotLake(field) {
        return field.type !== FieldType_1.FieldType.LAKE;
    }
    static isNotHomeBase(field) {
        return field.type !== FieldType_1.FieldType.HOMEBASE;
    }
    toString() {
        return `${this.name}:${this.type}`;
    }
}
Field.black = new Field(FieldName_1.FieldName.black, FieldType_1.FieldType.HOMEBASE);
Field.blue = new Field(FieldName_1.FieldName.blue, FieldType_1.FieldType.HOMEBASE);
Field.green = new Field(FieldName_1.FieldName.green, FieldType_1.FieldType.HOMEBASE);
Field.purple = new Field(FieldName_1.FieldName.purple, FieldType_1.FieldType.HOMEBASE);
Field.red = new Field(FieldName_1.FieldName.red, FieldType_1.FieldType.HOMEBASE);
Field.white = new Field(FieldName_1.FieldName.white, FieldType_1.FieldType.HOMEBASE);
Field.yellow = new Field(FieldName_1.FieldName.yellow, FieldType_1.FieldType.HOMEBASE);
Field.F = new Field(FieldName_1.FieldName.F, FieldType_1.FieldType.FACTORY);
Field.f1 = new Field(FieldName_1.FieldName.f1, FieldType_1.FieldType.FARM);
Field.f2 = new Field(FieldName_1.FieldName.f2, FieldType_1.FieldType.FARM);
Field.f3 = new Field(FieldName_1.FieldName.f3, FieldType_1.FieldType.FARM);
Field.f4 = new Field(FieldName_1.FieldName.f4, FieldType_1.FieldType.FARM);
Field.f5 = new Field(FieldName_1.FieldName.f5, FieldType_1.FieldType.FARM);
Field.f6 = new Field(FieldName_1.FieldName.f6, FieldType_1.FieldType.FARM);
Field.f7 = new Field(FieldName_1.FieldName.f7, FieldType_1.FieldType.FARM);
Field.l1 = new Field(FieldName_1.FieldName.l1, FieldType_1.FieldType.LAKE);
Field.l2 = new Field(FieldName_1.FieldName.l2, FieldType_1.FieldType.LAKE);
Field.l3 = new Field(FieldName_1.FieldName.l2, FieldType_1.FieldType.LAKE);
Field.l4 = new Field(FieldName_1.FieldName.l4, FieldType_1.FieldType.LAKE);
Field.l5 = new Field(FieldName_1.FieldName.l5, FieldType_1.FieldType.LAKE);
Field.l6 = new Field(FieldName_1.FieldName.l6, FieldType_1.FieldType.LAKE);
Field.l7 = new Field(FieldName_1.FieldName.l7, FieldType_1.FieldType.LAKE);
Field.m1 = new Field(FieldName_1.FieldName.m1, FieldType_1.FieldType.MOUNTAIN);
Field.m2 = new Field(FieldName_1.FieldName.m2, FieldType_1.FieldType.MOUNTAIN);
Field.m3 = new Field(FieldName_1.FieldName.m3, FieldType_1.FieldType.MOUNTAIN);
Field.m4 = new Field(FieldName_1.FieldName.m4, FieldType_1.FieldType.MOUNTAIN);
Field.m5 = new Field(FieldName_1.FieldName.m5, FieldType_1.FieldType.MOUNTAIN);
Field.m6 = new Field(FieldName_1.FieldName.m6, FieldType_1.FieldType.MOUNTAIN);
Field.m7 = new Field(FieldName_1.FieldName.m7, FieldType_1.FieldType.MOUNTAIN);
Field.m8 = new Field(FieldName_1.FieldName.m8, FieldType_1.FieldType.MOUNTAIN);
Field.t1 = new Field(FieldName_1.FieldName.t1, FieldType_1.FieldType.TUNDRA);
Field.t2 = new Field(FieldName_1.FieldName.t2, FieldType_1.FieldType.TUNDRA);
Field.t3 = new Field(FieldName_1.FieldName.t3, FieldType_1.FieldType.TUNDRA);
Field.t4 = new Field(FieldName_1.FieldName.t4, FieldType_1.FieldType.TUNDRA);
Field.t5 = new Field(FieldName_1.FieldName.t5, FieldType_1.FieldType.TUNDRA);
Field.t6 = new Field(FieldName_1.FieldName.t6, FieldType_1.FieldType.TUNDRA);
Field.t7 = new Field(FieldName_1.FieldName.t7, FieldType_1.FieldType.TUNDRA);
Field.t8 = new Field(FieldName_1.FieldName.t8, FieldType_1.FieldType.TUNDRA);
Field.v1 = new Field(FieldName_1.FieldName.v1, FieldType_1.FieldType.VILLAGE);
Field.v2 = new Field(FieldName_1.FieldName.v2, FieldType_1.FieldType.VILLAGE);
Field.v3 = new Field(FieldName_1.FieldName.v3, FieldType_1.FieldType.VILLAGE);
Field.v4 = new Field(FieldName_1.FieldName.v4, FieldType_1.FieldType.VILLAGE);
Field.v5 = new Field(FieldName_1.FieldName.v5, FieldType_1.FieldType.VILLAGE);
Field.v6 = new Field(FieldName_1.FieldName.v6, FieldType_1.FieldType.VILLAGE);
Field.v7 = new Field(FieldName_1.FieldName.v7, FieldType_1.FieldType.VILLAGE);
Field.v8 = new Field(FieldName_1.FieldName.v8, FieldType_1.FieldType.VILLAGE);
Field.v9 = new Field(FieldName_1.FieldName.v9, FieldType_1.FieldType.VILLAGE);
Field.w1 = new Field(FieldName_1.FieldName.w1, FieldType_1.FieldType.FOREST);
Field.w2 = new Field(FieldName_1.FieldName.w2, FieldType_1.FieldType.FOREST);
Field.w3 = new Field(FieldName_1.FieldName.w3, FieldType_1.FieldType.FOREST);
Field.w4 = new Field(FieldName_1.FieldName.w4, FieldType_1.FieldType.FOREST);
Field.w5 = new Field(FieldName_1.FieldName.w5, FieldType_1.FieldType.FOREST);
Field.w6 = new Field(FieldName_1.FieldName.w6, FieldType_1.FieldType.FOREST);
Field.w7 = new Field(FieldName_1.FieldName.w7, FieldType_1.FieldType.FOREST);
exports.Field = Field;

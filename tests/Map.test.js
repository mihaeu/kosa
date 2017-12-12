"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = require("../src/Map");
const Field_1 = require("../src/Field");
const FieldType_1 = require("../src/FieldType");
test('Factory is connected to five fields', () => {
    expect(new Map_1.Map().options('F').length).toBe(6);
});
test('Cannot walk from t3 to v1 without river-walk', () => {
    expect(new Map_1.Map().options('t3')).not.toContain(new Field_1.Field('v1', FieldType_1.FieldType.VILLAGE));
});
test('Can walk from t3 to w3', () => {
    expect(new Map_1.Map().options('t3')).toContain(new Field_1.Field('w3', FieldType_1.FieldType.VILLAGE));
});
test('Cannot walk from t3 to l2', () => {
    expect(new Map_1.Map().options('t3')).not.toContain(new Field_1.Field('l2', FieldType_1.FieldType.LAKE));
});

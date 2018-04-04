"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("../src/Field");
test("Field has name and type", () => {
    expect(Field_1.Field.t3.toString()).toBe("t3:TUNDRA");
});
test("Detects lakes", () => {
    expect(Field_1.Field.isNotLake(Field_1.Field.m6)).toBeTruthy();
    expect(Field_1.Field.isNotLake(Field_1.Field.l1)).toBeFalsy();
});
test("Detects homebases", () => {
    expect(Field_1.Field.isNotHomeBase(Field_1.Field.m6)).toBeTruthy();
    expect(Field_1.Field.isNotHomeBase(Field_1.Field.green)).toBeFalsy();
});

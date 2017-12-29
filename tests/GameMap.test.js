"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("../src/Field");
const GameMap_1 = require("../src/GameMap");
test("Factory is connected to six fields", () => {
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.F, Field_1.Field.w3)).toBeTruthy();
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.F, Field_1.Field.l5)).toBeTruthy();
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.F, Field_1.Field.t5)).toBeTruthy();
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.F, Field_1.Field.l6)).toBeTruthy();
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.F, Field_1.Field.m4)).toBeTruthy();
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.F, Field_1.Field.l4)).toBeTruthy();
});
test("Cannot walk from t3 to v1 without river-walk", () => {
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.t3, Field_1.Field.v1)).toBeFalsy();
});
test("Can walk from t3 to w4", () => {
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.t3, Field_1.Field.w4)).toBeTruthy();
});
test("Cannot walk from t3 to l2", () => {
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.t3, Field_1.Field.l2)).toBeFalsy();
});
test("Can walk from green to t2 with distance 2", () => {
    expect(new GameMap_1.GameMap().isReachable(Field_1.Field.green, Field_1.Field.t2, 2)).toBeTruthy();
});

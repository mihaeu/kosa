import {Field} from "../src/Field";
import {GameMap} from "../src/GameMap";

test("Factory is connected to six fields", () => {
    expect(new GameMap().isReachable(Field.F, Field.w3)).toBeTruthy();
    expect(new GameMap().isReachable(Field.F, Field.l5)).toBeTruthy();
    expect(new GameMap().isReachable(Field.F, Field.t5)).toBeTruthy();
    expect(new GameMap().isReachable(Field.F, Field.l6)).toBeTruthy();
    expect(new GameMap().isReachable(Field.F, Field.m4)).toBeTruthy();
    expect(new GameMap().isReachable(Field.F, Field.l4)).toBeTruthy();
});

test("Cannot walk from t3 to v1 without river-walk", () => {
    expect(new GameMap().isReachable(Field.t3, Field.v1)).toBeFalsy();
});

test("Can walk from t3 to w4", () => {
    expect(new GameMap().isReachable(Field.t3, Field.w4)).toBeTruthy();
});

test("Cannot walk from t3 to l2", () => {
    expect(new GameMap().isReachable(Field.t3, Field.l2)).toBeFalsy();
});

test("Can walk from green to t2 with distance 2", () => {
    expect(new GameMap().isReachable(Field.green, Field.t2, 2)).toBeTruthy();
});

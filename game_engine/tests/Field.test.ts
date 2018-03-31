import {Field} from "../src/Field";

test("Field has name and type", () => {
    expect(Field.t3.toString()).toBe("t3:TUNDRA");
});

test("Detects lakes", () => {
    expect(Field.isNotLake(Field.m6)).toBeTruthy();
    expect(Field.isNotLake(Field.l1)).toBeFalsy();
});

test("Detects homebases", () => {
    expect(Field.isNotHomebase(Field.m6)).toBeTruthy();
    expect(Field.isNotHomebase(Field.green)).toBeFalsy();
});

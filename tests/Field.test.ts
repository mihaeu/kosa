import {Field} from "../src/Field";

test("Field has name and type", () => {
    expect(Field.t3.toString()).toBe("t3:TUNDRA");
});
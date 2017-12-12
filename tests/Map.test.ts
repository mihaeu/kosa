import {Map} from "../src/Map";
import {Field} from "../src/Field";
import {FieldType} from "../src/FieldType";

test('Factory is connected to five fields', () => {
    expect(new Map().options('F').length).toBe(6);
});

test('Cannot walk from t3 to v1 without river-walk', () => {
    expect(new Map().options('t3')).not.toContain(new Field('v1', FieldType.VILLAGE));
});

test('Can walk from t3 to w3', () => {
    expect(new Map().options('t3')).toContain(new Field('w3', FieldType.VILLAGE));
});

test('Cannot walk from t3 to l2', () => {
    expect(new Map().options('t3')).not.toContain(new Field('l2', FieldType.LAKE));
});


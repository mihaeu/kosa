import {Field} from "./Field";
import {FieldType} from "./FieldType";
import {FieldConnection} from "./FieldConnection";
import Collections = require('typescript-collections');

export interface Connection {
    field: Field,
    connectionType: FieldConnection
}

export class Map {

    private fields: Collections.Dictionary<Field, Connection[]> = new Collections.Dictionary<Field, Connection[]>();

    private readonly black = new Field('black', FieldType.HOMEBASE);
    private readonly blue = new Field('blue', FieldType.HOMEBASE);
    private readonly green = new Field('green', FieldType.HOMEBASE);
    private readonly purple = new Field('purple', FieldType.HOMEBASE);
    private readonly red = new Field('red', FieldType.HOMEBASE);
    private readonly white = new Field('white', FieldType.HOMEBASE);
    private readonly yellow = new Field('yellow', FieldType.HOMEBASE);
    private readonly F = new Field('F', FieldType.FACTORY);
    private readonly f1 = new Field('f1', FieldType.FARM);
    private readonly f2 = new Field('f2', FieldType.FARM);
    private readonly f3 = new Field('f3', FieldType.FARM);
    private readonly f4 = new Field('f4', FieldType.FARM);
    private readonly f5 = new Field('f5', FieldType.FARM);
    private readonly f6 = new Field('f6', FieldType.FARM);
    private readonly f7 = new Field('f7', FieldType.FARM);
    private readonly l1 = new Field('l1', FieldType.LAKE);
    private readonly l2 = new Field('l2', FieldType.LAKE);
    private readonly l4 = new Field('l4', FieldType.LAKE);
    private readonly l5 = new Field('l5', FieldType.LAKE);
    private readonly l6 = new Field('l6', FieldType.LAKE);
    private readonly l7 = new Field('l7', FieldType.LAKE);
    private readonly m1 = new Field('m1', FieldType.MOUNTAIN);
    private readonly m2 = new Field('m2', FieldType.MOUNTAIN);
    private readonly m3 = new Field('m3', FieldType.MOUNTAIN);
    private readonly m4 = new Field('m4', FieldType.MOUNTAIN);
    private readonly m5 = new Field('m5', FieldType.MOUNTAIN);
    private readonly m6 = new Field('m6', FieldType.MOUNTAIN);
    private readonly m7 = new Field('m7', FieldType.MOUNTAIN);
    private readonly m8 = new Field('m8', FieldType.MOUNTAIN);
    private readonly t1 = new Field('t1', FieldType.TUNDRA);
    private readonly t2 = new Field('t2', FieldType.TUNDRA);
    private readonly t3 = new Field('t3', FieldType.TUNDRA);
    private readonly t4 = new Field('t4', FieldType.TUNDRA);
    private readonly t5 = new Field('t5', FieldType.TUNDRA);
    private readonly t6 = new Field('t6', FieldType.TUNDRA);
    private readonly t7 = new Field('t7', FieldType.TUNDRA);
    private readonly t8 = new Field('t8', FieldType.TUNDRA);
    private readonly v1 = new Field('v1', FieldType.VILLAGE);
    private readonly v2 = new Field('v2', FieldType.VILLAGE);
    private readonly v3 = new Field('v3', FieldType.VILLAGE);
    private readonly v4 = new Field('v4', FieldType.VILLAGE);
    private readonly v5 = new Field('v5', FieldType.VILLAGE);
    private readonly v6 = new Field('v6', FieldType.VILLAGE);
    private readonly v7 = new Field('v7', FieldType.VILLAGE);
    private readonly v8 = new Field('v8', FieldType.VILLAGE);
    private readonly v9 = new Field('v9', FieldType.VILLAGE);
    private readonly w1 = new Field('w1', FieldType.FOREST);
    private readonly w2 = new Field('w2', FieldType.FOREST);
    private readonly w3 = new Field('w3', FieldType.FOREST);
    private readonly w4 = new Field('w4', FieldType.FOREST);
    private readonly w5 = new Field('w5', FieldType.FOREST);
    private readonly w6 = new Field('w6', FieldType.FOREST);
    private readonly w7 = new Field('w7', FieldType.FOREST);

    constructor() {
        this.fields.setValue(this.green, [
            {field: this.m1, connectionType: FieldConnection.DEFAULT},
            {field: this.f1, connectionType: FieldConnection.DEFAULT}
        ]);

        this.fields.setValue(this.blue, [
            {field: this.w1, connectionType: FieldConnection.DEFAULT},
            {field: this.t1, connectionType: FieldConnection.DEFAULT}
        ]);

        this.fields.setValue(this.white, [
            {field: this.w2, connectionType: FieldConnection.DEFAULT},
            {field: this.w4, connectionType: FieldConnection.DEFAULT},
            {field: this.l1, connectionType: FieldConnection.DEFAULT}
        ]);

        this.fields.setValue(this.red, [
            {field: this.f3, connectionType: FieldConnection.DEFAULT},
            {field: this.v3, connectionType: FieldConnection.DEFAULT},
            {field: this.m5, connectionType: FieldConnection.DEFAULT}
        ]);

        this.fields.setValue(this.black, [
            {field: this.m6, connectionType: FieldConnection.DEFAULT},
            {field: this.t8, connectionType: FieldConnection.DEFAULT}
        ]);

        this.fields.setValue(this.purple, {field: this.t7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.purple, {field: this.f7, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.yellow, {field: this.f6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.yellow, {field: this.v9, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.m1, {field: this.f1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m1, {field: this.l1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m1, {field: this.t2, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.f1, {field: this.m1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f1, {field: this.t2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f1, {field: this.l2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f1, {field: this.v1, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.v1, {field: this.f1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v1, {field: this.l2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v1, {field: this.t3, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.v1, {field: this.w1, connectionType: FieldConnection.RIVER});

        this.fields.setValue(this.w1, {field: this.v1, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.w1, {field: this.t3, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.w1, {field: this.m2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w1, {field: this.t1, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t1, {field: this.w1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t1, {field: this.m2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t1, {field: this.f2, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.t1, {field: this.v2, connectionType: FieldConnection.RIVER});

        this.fields.setValue(this.v2, {field: this.t1, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.v2, {field: this.f2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v2, {field: this.f3, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.l1, {field: this.w2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l1, {field: this.t2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l1, {field: this.m1, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t2, {field: this.m1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t2, {field: this.l1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t2, {field: this.w2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t2, {field: this.m3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t2, {field: this.l2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t2, {field: this.f1, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.l2, {field: this.f1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l2, {field: this.t2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l2, {field: this.m3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l2, {field: this.w3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l2, {field: this.t3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l2, {field: this.v1, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t3, {field: this.v1, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.t3, {field: this.l2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t3, {field: this.w3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t3, {field: this.l4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t3, {field: this.m2, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.t3, {field: this.w1, connectionType: FieldConnection.RIVER});

        this.fields.setValue(this.m2, {field: this.w1, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.m2, {field: this.t3, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.m2, {field: this.l4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m2, {field: this.w4, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.m2, {field: this.f2, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.m2, {field: this.t1, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.f2, {field: this.t1, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.f2, {field: this.m2, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.f2, {field: this.w4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f2, {field: this.v3, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.f2, {field: this.f3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f2, {field: this.v2, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.f3, {field: this.v2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f3, {field: this.f2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f3, {field: this.v3, connectionType: FieldConnection.RIVER});

        this.fields.setValue(this.w2, {field: this.l1, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w2, {field: this.f4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w2, {field: this.v4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w2, {field: this.m3, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.w2, {field: this.t2, connectionType: FieldConnection.RIVER});

        this.fields.setValue(this.m3, {field: this.t2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m3, {field: this.w2, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.m3, {field: this.v4, connectionType: FieldConnection.RIVER});
        this.fields.setValue(this.m3, {field: this.l5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m3, {field: this.w3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m3, {field: this.l2, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.w3, {field: this.l2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w3, {field: this.m3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w3, {field: this.l5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w3, {field: this.F, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w3, {field: this.l4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w3, {field: this.t3, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.l4, {field: this.t3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l4, {field: this.w3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l4, {field: this.F, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l4, {field: this.m4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l4, {field: this.w4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l4, {field: this.m2, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.w4, {field: this.m2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w4, {field: this.l4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w4, {field: this.m4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w4, {field: this.t4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w4, {field: this.v3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w4, {field: this.f2, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.v3, {field: this.f2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v3, {field: this.w4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v3, {field: this.t4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v3, {field: this.m5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v3, {field: this.f3, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.f4, {field: this.w5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f4, {field: this.w6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f4, {field: this.v4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f4, {field: this.w2, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.v4, {field: this.w2, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v4, {field: this.f4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v4, {field: this.w6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v4, {field: this.f5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v4, {field: this.l5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v4, {field: this.m3, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.l5, {field: this.m3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l5, {field: this.v4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l5, {field: this.f5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l5, {field: this.t5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l5, {field: this.F, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l5, {field: this.w3, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.F, {field: this.w3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.F, {field: this.l5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.F, {field: this.t5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.F, {field: this.l6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.F, {field: this.m4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.F, {field: this.l4, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.m4, {field: this.l4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m4, {field: this.F, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m4, {field: this.l6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m4, {field: this.v5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m4, {field: this.t4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m4, {field: this.w4, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t4, {field: this.w4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t4, {field: this.m4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t4, {field: this.v5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t4, {field: this.l7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t4, {field: this.m5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t4, {field: this.v3, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.m5, {field: this.v3, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m5, {field: this.t4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m5, {field: this.l7, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.w5, {field: this.m6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w5, {field: this.w6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w5, {field: this.f4, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.w6, {field: this.f4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w6, {field: this.w5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w6, {field: this.m6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w6, {field: this.v6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w6, {field: this.f5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w6, {field: this.v4, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.f5, {field: this.v4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f5, {field: this.w6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f5, {field: this.v6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f5, {field: this.v7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f5, {field: this.t5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f5, {field: this.l5, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t5, {field: this.l5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t5, {field: this.f5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t5, {field: this.v7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t5, {field: this.t6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t5, {field: this.l6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t5, {field: this.F, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.l6, {field: this.F, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l6, {field: this.t5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l6, {field: this.t6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l6, {field: this.w7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l6, {field: this.v5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l6, {field: this.m4, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.v5, {field: this.m4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v5, {field: this.l6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v5, {field: this.w7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v5, {field: this.m7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v5, {field: this.l7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v5, {field: this.t4, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.l7, {field: this.t4, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l7, {field: this.v5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l7, {field: this.m7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l7, {field: this.l7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l7, {field: this.t4, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.m6, {field: this.w5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m6, {field: this.t8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m6, {field: this.v6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m6, {field: this.w6, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.v6, {field: this.w6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v6, {field: this.m6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v6, {field: this.t8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v6, {field: this.l7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v6, {field: this.v7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v6, {field: this.f5, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.v7, {field: this.f5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v7, {field: this.v6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v7, {field: this.l7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v7, {field: this.f6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v7, {field: this.t6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v7, {field: this.t5, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t6, {field: this.t5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t6, {field: this.v7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t6, {field: this.f6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t6, {field: this.m8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t6, {field: this.w7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t6, {field: this.l6, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.w7, {field: this.l6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w7, {field: this.t6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w7, {field: this.m8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w7, {field: this.v8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w7, {field: this.m7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.w7, {field: this.v5, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.m7, {field: this.v5, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m7, {field: this.w7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m7, {field: this.v8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m7, {field: this.f7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m7, {field: this.t7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m7, {field: this.l7, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t7, {field: this.l7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t7, {field: this.m7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t7, {field: this.f7, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t8, {field: this.m6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t8, {field: this.l7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.t8, {field: this.v6, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.l7, {field: this.v6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l7, {field: this.t8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l7, {field: this.f6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.l7, {field: this.v7, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.f6, {field: this.v7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f6, {field: this.l7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f6, {field: this.v9, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f6, {field: this.m8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f6, {field: this.t6, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.m8, {field: this.t6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m8, {field: this.f6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m8, {field: this.v9, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m8, {field: this.v8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.m8, {field: this.w7, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.v8, {field: this.w7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v8, {field: this.m8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v8, {field: this.f7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v8, {field: this.m7, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.f7, {field: this.m7, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f7, {field: this.v8, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.f7, {field: this.t7, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.v9, {field: this.f6, connectionType: FieldConnection.DEFAULT});
        this.fields.setValue(this.v9, {field: this.m8, connectionType: FieldConnection.DEFAULT});

        this.fields.setValue(this.t3, {field: this.w4, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.t3, {field: this.m3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.t3, {field: this.f5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.t3, {field: this.v5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.t3, {field: this.t6, connectionType: FieldConnection.TUNNEL});

        this.fields.setValue(this.m3, {field: this.w4, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.m3, {field: this.t3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.m3, {field: this.f5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.m3, {field: this.v5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.m3, {field: this.t6, connectionType: FieldConnection.TUNNEL});

        this.fields.setValue(this.w4, {field: this.t3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.w4, {field: this.m3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.w4, {field: this.f5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.w4, {field: this.v5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.w4, {field: this.t6, connectionType: FieldConnection.TUNNEL});

        this.fields.setValue(this.f5, {field: this.t3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.f5, {field: this.m3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.f5, {field: this.w4, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.f5, {field: this.v5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.f5, {field: this.t6, connectionType: FieldConnection.TUNNEL});

        this.fields.setValue(this.v5, {field: this.t3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.v5, {field: this.m3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.v5, {field: this.w4, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.v5, {field: this.f5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.v5, {field: this.t6, connectionType: FieldConnection.TUNNEL});

        this.fields.setValue(this.t6, {field: this.t3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.t6, {field: this.m3, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.t6, {field: this.w4, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.t6, {field: this.f5, connectionType: FieldConnection.TUNNEL});
        this.fields.setValue(this.t6, {field: this.v5, connectionType: FieldConnection.TUNNEL});
    }

    options(name: string) : Field[] {
        if (!this.fields.containsKey(name)) {
            return [];
        }
        return this.fields.getValue(name).getConnectedFields()
            .filter((connection: Connection) => connection.connection === FieldConnection.DEFAULT)
            .map((connection: Connection) => connection.field);
    }
}
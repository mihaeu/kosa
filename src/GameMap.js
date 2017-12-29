"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = require("./Connection");
const Field_1 = require("./Field");
const FieldConnection_1 = require("./FieldConnection");
class GameMap {
    constructor() {
        this.fields = new Map();
        this.fields.set(Field_1.Field.green, [
            new Connection_1.Connection(Field_1.Field.m1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.blue, [
            new Connection_1.Connection(Field_1.Field.w1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.white, [
            new Connection_1.Connection(Field_1.Field.w2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.red, [
            new Connection_1.Connection(Field_1.Field.f3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m5, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.black, [
            new Connection_1.Connection(Field_1.Field.m6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t8, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.purple, [
            new Connection_1.Connection(Field_1.Field.t7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f7, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.yellow, [
            new Connection_1.Connection(Field_1.Field.f6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v9, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.m1, [
            new Connection_1.Connection(Field_1.Field.f1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t2, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.f1, [
            new Connection_1.Connection(Field_1.Field.m1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.v1, [
            new Connection_1.Connection(Field_1.Field.f1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.w1, FieldConnection_1.FieldConnection.RIVER),
        ]);
        this.fields.set(Field_1.Field.w1, [
            new Connection_1.Connection(Field_1.Field.v1, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.m2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t1, [
            new Connection_1.Connection(Field_1.Field.w1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f2, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.v2, FieldConnection_1.FieldConnection.RIVER),
        ]);
        this.fields.set(Field_1.Field.v2, [
            new Connection_1.Connection(Field_1.Field.t1, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.f2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f3, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.l1, [
            new Connection_1.Connection(Field_1.Field.w2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t2, [
            new Connection_1.Connection(Field_1.Field.m1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.l2, [
            new Connection_1.Connection(Field_1.Field.f1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t3, [
            new Connection_1.Connection(Field_1.Field.v1, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.l2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m2, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.w1, FieldConnection_1.FieldConnection.RIVER),
        ]);
        this.fields.set(Field_1.Field.m2, [
            new Connection_1.Connection(Field_1.Field.w1, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.l4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.f2, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.t1, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.f2, [
            new Connection_1.Connection(Field_1.Field.t1, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.m2, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v3, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.f3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v2, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.f3, [
            new Connection_1.Connection(Field_1.Field.v2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v3, FieldConnection_1.FieldConnection.RIVER),
        ]);
        this.fields.set(Field_1.Field.w2, [
            new Connection_1.Connection(Field_1.Field.l1, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.t2, FieldConnection_1.FieldConnection.RIVER),
        ]);
        this.fields.set(Field_1.Field.m3, [
            new Connection_1.Connection(Field_1.Field.t2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w2, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.v4, FieldConnection_1.FieldConnection.RIVER),
            new Connection_1.Connection(Field_1.Field.l5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l2, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.w3, [
            new Connection_1.Connection(Field_1.Field.l2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.F, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.l4, [
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.F, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m2, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.w4, [
            new Connection_1.Connection(Field_1.Field.m2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f2, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.v3, [
            new Connection_1.Connection(Field_1.Field.f2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f3, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.f4, [
            new Connection_1.Connection(Field_1.Field.w5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w2, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.v4, [
            new Connection_1.Connection(Field_1.Field.w2, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.l5, [
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.F, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w3, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.F, [
            new Connection_1.Connection(Field_1.Field.w3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l4, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.m4, [
            new Connection_1.Connection(Field_1.Field.l4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.F, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t4, [
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v3, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.m5, [
            new Connection_1.Connection(Field_1.Field.v3, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.w5, [
            new Connection_1.Connection(Field_1.Field.m6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f4, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.w6, [
            new Connection_1.Connection(Field_1.Field.f4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v4, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.f5, [
            new Connection_1.Connection(Field_1.Field.v4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l5, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t5, [
            new Connection_1.Connection(Field_1.Field.l5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.F, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.l6, [
            new Connection_1.Connection(Field_1.Field.F, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m4, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.v5, [
            new Connection_1.Connection(Field_1.Field.m4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t4, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.l7, [
            new Connection_1.Connection(Field_1.Field.t4, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t4, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.m6, [
            new Connection_1.Connection(Field_1.Field.w5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w6, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.v6, [
            new Connection_1.Connection(Field_1.Field.w6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.v7, [
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t5, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t6, [
            new Connection_1.Connection(Field_1.Field.t5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l6, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.w7, [
            new Connection_1.Connection(Field_1.Field.l6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.m7, [
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t7, [
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f7, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t8, [
            new Connection_1.Connection(Field_1.Field.m6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v6, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.l7, [
            new Connection_1.Connection(Field_1.Field.v6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v7, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.f6, [
            new Connection_1.Connection(Field_1.Field.v7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.l7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v9, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.m8, [
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v9, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.w7, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.v8, [
            new Connection_1.Connection(Field_1.Field.w7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.f7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m7, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.f7, [
            new Connection_1.Connection(Field_1.Field.m7, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.v8, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.t7, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.v9, [
            new Connection_1.Connection(Field_1.Field.f6, FieldConnection_1.FieldConnection.DEFAULT),
            new Connection_1.Connection(Field_1.Field.m8, FieldConnection_1.FieldConnection.DEFAULT),
        ]);
        this.fields.set(Field_1.Field.t3, [
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.TUNNEL),
        ]);
        this.fields.set(Field_1.Field.m3, [
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.TUNNEL),
        ]);
        this.fields.set(Field_1.Field.w4, [
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.TUNNEL),
        ]);
        this.fields.set(Field_1.Field.f5, [
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.TUNNEL),
        ]);
        this.fields.set(Field_1.Field.v5, [
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.t6, FieldConnection_1.FieldConnection.TUNNEL),
        ]);
        this.fields.set(Field_1.Field.t6, [
            new Connection_1.Connection(Field_1.Field.t3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.m3, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.w4, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.f5, FieldConnection_1.FieldConnection.TUNNEL),
            new Connection_1.Connection(Field_1.Field.v5, FieldConnection_1.FieldConnection.TUNNEL),
        ]);
    }
    isReachable(start, end, distance = 1) {
        if (distance === 0) {
            return false;
        }
        const options = this.options(start);
        if (options.length === 0) {
            return false;
        }
        if (options.some((field) => field === end)) {
            return true;
        }
        return options.some((field) => this.isReachable(field, end, distance - 1));
    }
    options(field) {
        const connections = this.fields.get(field);
        return connections === undefined
            ? []
            : connections
                .filter(Connection_1.Connection.isReachable)
                .map((connection) => connection.field);
    }
}
exports.GameMap = GameMap;

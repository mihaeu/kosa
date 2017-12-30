import {Connection} from "./Connection";
import {Field} from "./Field";
import {FieldConnection} from "./FieldConnection";
import {FieldName} from "./FieldName";

export class GameMap {

    private fields: Map<FieldName, Connection[]> = new Map<FieldName, Connection[]>();

    constructor() {
        this.fields.set(FieldName.green, [
            new Connection(Field.m1, FieldConnection.DEFAULT),
            new Connection(Field.f1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.blue, [
            new Connection(Field.w1, FieldConnection.DEFAULT),
            new Connection(Field.t1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.white, [
            new Connection(Field.w2, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.DEFAULT),
            new Connection(Field.l1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.red, [
            new Connection(Field.f3, FieldConnection.DEFAULT),
            new Connection(Field.v3, FieldConnection.DEFAULT),
            new Connection(Field.m5, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.black, [
            new Connection(Field.m6, FieldConnection.DEFAULT),
            new Connection(Field.t8, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.purple, [
            new Connection(Field.t7, FieldConnection.DEFAULT),
            new Connection(Field.f7, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.yellow, [
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.v9, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.m1, [
            new Connection(Field.f1, FieldConnection.DEFAULT),
            new Connection(Field.l1, FieldConnection.DEFAULT),
            new Connection(Field.t2, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.f1, [
            new Connection(Field.m1, FieldConnection.DEFAULT),
            new Connection(Field.t2, FieldConnection.DEFAULT),
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.v1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.v1, [
            new Connection(Field.f1, FieldConnection.DEFAULT),
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.RIVER),
            new Connection(Field.w1, FieldConnection.RIVER),
        ]);

        this.fields.set(FieldName.w1, [
            new Connection(Field.v1, FieldConnection.RIVER),
            new Connection(Field.t3, FieldConnection.RIVER),
            new Connection(Field.m2, FieldConnection.DEFAULT),
            new Connection(Field.t1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.t1, [
            new Connection(Field.w1, FieldConnection.DEFAULT),
            new Connection(Field.m2, FieldConnection.DEFAULT),
            new Connection(Field.f2, FieldConnection.RIVER),
            new Connection(Field.v2, FieldConnection.RIVER),
        ]);

        this.fields.set(FieldName.v2, [
            new Connection(Field.t1, FieldConnection.RIVER),
            new Connection(Field.f2, FieldConnection.DEFAULT),
            new Connection(Field.f3, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.l1, [
            new Connection(Field.w2, FieldConnection.DEFAULT),
            new Connection(Field.t2, FieldConnection.DEFAULT),
            new Connection(Field.m1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.t2, [
            new Connection(Field.m1, FieldConnection.DEFAULT),
            new Connection(Field.l1, FieldConnection.DEFAULT),
            new Connection(Field.w2, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.DEFAULT),
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.f1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.l2, [
            new Connection(Field.f1, FieldConnection.DEFAULT),
            new Connection(Field.t2, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.DEFAULT),
            new Connection(Field.w3, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.DEFAULT),
            new Connection(Field.v1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.t3, [
            new Connection(Field.v1, FieldConnection.RIVER),
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.w3, FieldConnection.DEFAULT),
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.m2, FieldConnection.RIVER),
            new Connection(Field.w1, FieldConnection.RIVER),
            new Connection(Field.w4, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.f5, FieldConnection.TUNNEL),
            new Connection(Field.v5, FieldConnection.TUNNEL),
            new Connection(Field.t6, FieldConnection.TUNNEL),
        ]);

        this.fields.set(FieldName.m2, [
            new Connection(Field.w1, FieldConnection.RIVER),
            new Connection(Field.t3, FieldConnection.RIVER),
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.RIVER),
            new Connection(Field.f2, FieldConnection.RIVER),
            new Connection(Field.t1, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.f2, [
            new Connection(Field.t1, FieldConnection.RIVER),
            new Connection(Field.m2, FieldConnection.RIVER),
            new Connection(Field.w4, FieldConnection.DEFAULT),
            new Connection(Field.v3, FieldConnection.RIVER),
            new Connection(Field.f3, FieldConnection.DEFAULT),
            new Connection(Field.v2, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.f3, [
            new Connection(Field.v2, FieldConnection.DEFAULT),
            new Connection(Field.f2, FieldConnection.DEFAULT),
            new Connection(Field.v3, FieldConnection.RIVER),
        ]);

        this.fields.set(FieldName.w2, [
            new Connection(Field.l1, FieldConnection.DEFAULT),
            new Connection(Field.f4, FieldConnection.DEFAULT),
            new Connection(Field.v4, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.RIVER),
            new Connection(Field.t2, FieldConnection.RIVER),
        ]);

        this.fields.set(FieldName.m3, [
            new Connection(Field.t2, FieldConnection.DEFAULT),
            new Connection(Field.w2, FieldConnection.RIVER),
            new Connection(Field.v4, FieldConnection.RIVER),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.w3, FieldConnection.DEFAULT),
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.TUNNEL),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.f5, FieldConnection.TUNNEL),
            new Connection(Field.v5, FieldConnection.TUNNEL),
            new Connection(Field.t6, FieldConnection.TUNNEL),
        ]);

        this.fields.set(FieldName.w3, [
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.DEFAULT),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.l4, [
            new Connection(Field.t3, FieldConnection.DEFAULT),
            new Connection(Field.w3, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.DEFAULT),
            new Connection(Field.m2, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.w4, [
            new Connection(Field.m2, FieldConnection.DEFAULT),
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.v3, FieldConnection.DEFAULT),
            new Connection(Field.f2, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.f5, FieldConnection.TUNNEL),
            new Connection(Field.v5, FieldConnection.TUNNEL),
            new Connection(Field.t6, FieldConnection.TUNNEL),
        ]);

        this.fields.set(FieldName.v3, [
            new Connection(Field.f2, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.m5, FieldConnection.DEFAULT),
            new Connection(Field.f3, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.f4, [
            new Connection(Field.w5, FieldConnection.DEFAULT),
            new Connection(Field.w6, FieldConnection.DEFAULT),
            new Connection(Field.v4, FieldConnection.DEFAULT),
            new Connection(Field.w2, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.v4, [
            new Connection(Field.w2, FieldConnection.DEFAULT),
            new Connection(Field.f4, FieldConnection.DEFAULT),
            new Connection(Field.w6, FieldConnection.DEFAULT),
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.l5, [
            new Connection(Field.m3, FieldConnection.DEFAULT),
            new Connection(Field.v4, FieldConnection.DEFAULT),
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.w3, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.F, [
            new Connection(Field.w3, FieldConnection.DEFAULT),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.l4, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.m4, [
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.t4, [
            new Connection(Field.w4, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.m5, FieldConnection.DEFAULT),
            new Connection(Field.v3, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.m5, [
            new Connection(Field.v3, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.w5, [
            new Connection(Field.m6, FieldConnection.DEFAULT),
            new Connection(Field.w6, FieldConnection.DEFAULT),
            new Connection(Field.f4, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.w6, [
            new Connection(Field.f4, FieldConnection.DEFAULT),
            new Connection(Field.w5, FieldConnection.DEFAULT),
            new Connection(Field.m6, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.DEFAULT),
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.v4, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.f5, [
            new Connection(Field.v4, FieldConnection.DEFAULT),
            new Connection(Field.w6, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.w4, FieldConnection.TUNNEL),
            new Connection(Field.v5, FieldConnection.TUNNEL),
            new Connection(Field.t6, FieldConnection.TUNNEL),
        ]);

        this.fields.set(FieldName.t5, [
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.l6, [
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.v5, [
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.w4, FieldConnection.TUNNEL),
            new Connection(Field.f5, FieldConnection.TUNNEL),
            new Connection(Field.t6, FieldConnection.TUNNEL),
        ]);

        this.fields.set(FieldName.l7, [
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.m6, [
            new Connection(Field.w5, FieldConnection.DEFAULT),
            new Connection(Field.t8, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.DEFAULT),
            new Connection(Field.w6, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.v6, [
            new Connection(Field.w6, FieldConnection.DEFAULT),
            new Connection(Field.m6, FieldConnection.DEFAULT),
            new Connection(Field.t8, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.DEFAULT),
            new Connection(Field.f5, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.v7, [
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.t6, [
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.DEFAULT),
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.DEFAULT),
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.w4, FieldConnection.TUNNEL),
            new Connection(Field.f5, FieldConnection.TUNNEL),
            new Connection(Field.v5, FieldConnection.TUNNEL),
        ]);

        this.fields.set(FieldName.w7, [
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.DEFAULT),
            new Connection(Field.v8, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.m7, [
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.v8, FieldConnection.DEFAULT),
            new Connection(Field.f7, FieldConnection.DEFAULT),
            new Connection(Field.t7, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.t7, [
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.f7, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.t8, [
            new Connection(Field.m6, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.l7, [
            new Connection(Field.v6, FieldConnection.DEFAULT),
            new Connection(Field.t8, FieldConnection.DEFAULT),
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.f6, [
            new Connection(Field.v7, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.v9, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.m8, [
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.v9, FieldConnection.DEFAULT),
            new Connection(Field.v8, FieldConnection.DEFAULT),
            new Connection(Field.w7, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.v8, [
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.DEFAULT),
            new Connection(Field.f7, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.f7, [
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.v8, FieldConnection.DEFAULT),
            new Connection(Field.t7, FieldConnection.DEFAULT),
        ]);

        this.fields.set(FieldName.v9, [
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.DEFAULT),
        ]);
    }

    public isReachable(start: Field, end: Field, distance: number = 1): boolean {
        if (distance === 0) {
            return false;
        }

        const options = this.options(start);
        if (options.length === 0) {
            return false;
        }

        if (options.some((field: Field) => field === end)) {
            return true;
        }

        return options.some((field: Field) => this.isReachable(field, end, distance - 1));
    }

    private options(field: Field): Field[] {
        const connections = this.fields.get(field.name);
        return connections === undefined
            ? []
            : connections
                .filter(Connection.isReachable)
                .filter(Connection.isNotLake)
                .map((connection: Connection) => connection.field);
    }
}

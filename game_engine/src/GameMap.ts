import { Connection } from "./Connection";
import { Field } from "./Field";
import { FieldConnection } from "./FieldConnection";
import { IllegalMoveError } from "./IllegalMoveError";
import { Unit } from "./Units/Unit";

export class GameMap {
    public static isReachable(start: Field, end: Field, distance: number = 1): boolean {
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

        return options.some((field: Field) => GameMap.isReachable(field, end, distance - 1));
    }

    public static options(field: Field): Field[] {
        const connections = this.fields.get(field);
        return connections === undefined
            ? []
            : connections
                  .filter(Connection.isReachable)
                  .map((connection: Connection) => connection.field)
                  .filter(Field.isNotHomeBase)
                  .filter(Field.isNotLake);
    }

    public static assertLegalMove(currentLocation: Field, destination: Field, unit: Unit): void {
        if (!GameMap.isReachable(currentLocation, destination)) {
            throw new IllegalMoveError(unit, currentLocation, destination);
        }
    }

    private static fields: Map<Field, Connection[]> = GameMap.init();

    private static init(): Map<Field, Connection[]> {
        const fields = new Map<Field, Connection[]>();

        fields.set(Field.green, [
            new Connection(Field.m1, FieldConnection.DEFAULT),
            new Connection(Field.f1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.blue, [
            new Connection(Field.w1, FieldConnection.DEFAULT),
            new Connection(Field.t1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.white, [
            new Connection(Field.w2, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.DEFAULT),
            new Connection(Field.l1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.red, [
            new Connection(Field.f3, FieldConnection.RIVER),
            new Connection(Field.v3, FieldConnection.DEFAULT),
            new Connection(Field.m5, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.black, [
            new Connection(Field.m6, FieldConnection.DEFAULT),
            new Connection(Field.t8, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.purple, [
            new Connection(Field.t7, FieldConnection.DEFAULT),
            new Connection(Field.f7, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.yellow, [
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.v9, FieldConnection.DEFAULT),
            new Connection(Field.l3, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.m1, [
            new Connection(Field.f1, FieldConnection.DEFAULT),
            new Connection(Field.l1, FieldConnection.DEFAULT),
            new Connection(Field.t2, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.f1, [
            new Connection(Field.m1, FieldConnection.DEFAULT),
            new Connection(Field.t2, FieldConnection.DEFAULT),
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.v1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.v1, [
            new Connection(Field.f1, FieldConnection.DEFAULT),
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.RIVER),
            new Connection(Field.w1, FieldConnection.RIVER),
        ]);

        fields.set(Field.w1, [
            new Connection(Field.v1, FieldConnection.RIVER),
            new Connection(Field.t3, FieldConnection.RIVER),
            new Connection(Field.m2, FieldConnection.DEFAULT),
            new Connection(Field.t1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.t1, [
            new Connection(Field.w1, FieldConnection.DEFAULT),
            new Connection(Field.m2, FieldConnection.DEFAULT),
            new Connection(Field.f2, FieldConnection.RIVER),
            new Connection(Field.v2, FieldConnection.RIVER),
        ]);

        fields.set(Field.v2, [
            new Connection(Field.t1, FieldConnection.RIVER),
            new Connection(Field.f2, FieldConnection.DEFAULT),
            new Connection(Field.f3, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.l1, [
            new Connection(Field.w2, FieldConnection.DEFAULT),
            new Connection(Field.t2, FieldConnection.DEFAULT),
            new Connection(Field.m1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.t2, [
            new Connection(Field.m1, FieldConnection.DEFAULT),
            new Connection(Field.l1, FieldConnection.DEFAULT),
            new Connection(Field.w2, FieldConnection.RIVER),
            new Connection(Field.m3, FieldConnection.DEFAULT),
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.f1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.l2, [
            new Connection(Field.f1, FieldConnection.DEFAULT),
            new Connection(Field.t2, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.DEFAULT),
            new Connection(Field.w3, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.DEFAULT),
            new Connection(Field.v1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.t3, [
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

        fields.set(Field.m2, [
            new Connection(Field.w1, FieldConnection.RIVER),
            new Connection(Field.t3, FieldConnection.RIVER),
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.RIVER),
            new Connection(Field.f2, FieldConnection.RIVER),
            new Connection(Field.t1, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.f2, [
            new Connection(Field.t1, FieldConnection.RIVER),
            new Connection(Field.m2, FieldConnection.RIVER),
            new Connection(Field.w4, FieldConnection.DEFAULT),
            new Connection(Field.v3, FieldConnection.RIVER),
            new Connection(Field.f3, FieldConnection.DEFAULT),
            new Connection(Field.v2, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.f3, [
            new Connection(Field.v2, FieldConnection.DEFAULT),
            new Connection(Field.f2, FieldConnection.DEFAULT),
            new Connection(Field.v3, FieldConnection.RIVER),
        ]);

        fields.set(Field.w2, [
            new Connection(Field.l1, FieldConnection.DEFAULT),
            new Connection(Field.f4, FieldConnection.DEFAULT),
            new Connection(Field.v4, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.RIVER),
            new Connection(Field.t2, FieldConnection.RIVER),
        ]);

        fields.set(Field.m3, [
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

        fields.set(Field.w3, [
            new Connection(Field.l2, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.DEFAULT),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.l4, [
            new Connection(Field.t3, FieldConnection.DEFAULT),
            new Connection(Field.w3, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.w4, FieldConnection.DEFAULT),
            new Connection(Field.m2, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.w4, [
            new Connection(Field.m2, FieldConnection.RIVER),
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.RIVER),
            new Connection(Field.v3, FieldConnection.RIVER),
            new Connection(Field.f2, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.f5, FieldConnection.TUNNEL),
            new Connection(Field.v5, FieldConnection.TUNNEL),
            new Connection(Field.t6, FieldConnection.TUNNEL),
        ]);

        fields.set(Field.v3, [
            new Connection(Field.f2, FieldConnection.RIVER),
            new Connection(Field.w4, FieldConnection.RIVER),
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.m5, FieldConnection.DEFAULT),
            new Connection(Field.f3, FieldConnection.RIVER),
        ]);

        fields.set(Field.f4, [
            new Connection(Field.w5, FieldConnection.RIVER),
            new Connection(Field.w6, FieldConnection.RIVER),
            new Connection(Field.v4, FieldConnection.DEFAULT),
            new Connection(Field.w2, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.v4, [
            new Connection(Field.w2, FieldConnection.DEFAULT),
            new Connection(Field.f4, FieldConnection.DEFAULT),
            new Connection(Field.w6, FieldConnection.RIVER),
            new Connection(Field.f5, FieldConnection.RIVER),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.m3, FieldConnection.RIVER),
        ]);

        fields.set(Field.l5, [
            new Connection(Field.m3, FieldConnection.DEFAULT),
            new Connection(Field.v4, FieldConnection.DEFAULT),
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.w3, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.F, [
            new Connection(Field.w3, FieldConnection.DEFAULT),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.l4, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.m4, [
            new Connection(Field.l4, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.RIVER),
            new Connection(Field.w4, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.t4, [
            new Connection(Field.w4, FieldConnection.RIVER),
            new Connection(Field.m4, FieldConnection.RIVER),
            new Connection(Field.v5, FieldConnection.RIVER),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.m5, FieldConnection.DEFAULT),
            new Connection(Field.v3, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.m5, [
            new Connection(Field.v3, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.w5, [
            new Connection(Field.m6, FieldConnection.RIVER),
            new Connection(Field.w6, FieldConnection.DEFAULT),
            new Connection(Field.f4, FieldConnection.RIVER),
        ]);

        fields.set(Field.w6, [
            new Connection(Field.f4, FieldConnection.RIVER),
            new Connection(Field.w5, FieldConnection.DEFAULT),
            new Connection(Field.m6, FieldConnection.RIVER),
            new Connection(Field.v6, FieldConnection.RIVER),
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.v4, FieldConnection.RIVER),
        ]);

        fields.set(Field.f5, [
            new Connection(Field.v4, FieldConnection.RIVER),
            new Connection(Field.w6, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.RIVER),
            new Connection(Field.v7, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.w4, FieldConnection.TUNNEL),
            new Connection(Field.v5, FieldConnection.TUNNEL),
            new Connection(Field.t6, FieldConnection.TUNNEL),
        ]);

        fields.set(Field.t5, [
            new Connection(Field.l5, FieldConnection.DEFAULT),
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.F, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.l6, [
            new Connection(Field.F, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.m4, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.v5, [
            new Connection(Field.m4, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.t4, FieldConnection.RIVER),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.w4, FieldConnection.TUNNEL),
            new Connection(Field.f5, FieldConnection.TUNNEL),
            new Connection(Field.t6, FieldConnection.TUNNEL),
        ]);

        fields.set(Field.l7, [
            new Connection(Field.t4, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.t7, FieldConnection.DEFAULT),
            new Connection(Field.m5, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.m6, [
            new Connection(Field.w5, FieldConnection.RIVER),
            new Connection(Field.t8, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.DEFAULT),
            new Connection(Field.w6, FieldConnection.RIVER),
        ]);

        fields.set(Field.v6, [
            new Connection(Field.w6, FieldConnection.RIVER),
            new Connection(Field.m6, FieldConnection.DEFAULT),
            new Connection(Field.t8, FieldConnection.DEFAULT),
            new Connection(Field.l3, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.RIVER),
            new Connection(Field.f5, FieldConnection.RIVER),
        ]);

        fields.set(Field.v7, [
            new Connection(Field.f5, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.RIVER),
            new Connection(Field.l3, FieldConnection.DEFAULT),
            new Connection(Field.f6, FieldConnection.RIVER),
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.t5, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.t6, [
            new Connection(Field.t5, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.DEFAULT),
            new Connection(Field.f6, FieldConnection.RIVER),
            new Connection(Field.m8, FieldConnection.RIVER),
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.t3, FieldConnection.TUNNEL),
            new Connection(Field.m3, FieldConnection.TUNNEL),
            new Connection(Field.w4, FieldConnection.TUNNEL),
            new Connection(Field.f5, FieldConnection.TUNNEL),
            new Connection(Field.v5, FieldConnection.TUNNEL),
        ]);

        fields.set(Field.w7, [
            new Connection(Field.l6, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.DEFAULT),
            new Connection(Field.v8, FieldConnection.RIVER),
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.v5, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.m7, [
            new Connection(Field.v5, FieldConnection.DEFAULT),
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.v8, FieldConnection.DEFAULT),
            new Connection(Field.f7, FieldConnection.DEFAULT),
            new Connection(Field.t7, FieldConnection.DEFAULT),
            new Connection(Field.l7, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.t7, [
            new Connection(Field.l7, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.f7, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.t8, [
            new Connection(Field.m6, FieldConnection.DEFAULT),
            new Connection(Field.l3, FieldConnection.DEFAULT),
            new Connection(Field.v6, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.l3, [
            new Connection(Field.v6, FieldConnection.DEFAULT),
            new Connection(Field.t8, FieldConnection.DEFAULT),
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.v7, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.f6, [
            new Connection(Field.v7, FieldConnection.RIVER),
            new Connection(Field.l3, FieldConnection.DEFAULT),
            new Connection(Field.v9, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.DEFAULT),
            new Connection(Field.t6, FieldConnection.RIVER),
        ]);

        fields.set(Field.m8, [
            new Connection(Field.t6, FieldConnection.RIVER),
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.v9, FieldConnection.DEFAULT),
            new Connection(Field.v8, FieldConnection.RIVER),
            new Connection(Field.w7, FieldConnection.RIVER),
        ]);

        fields.set(Field.v8, [
            new Connection(Field.w7, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.RIVER),
            new Connection(Field.f7, FieldConnection.DEFAULT),
            new Connection(Field.m7, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.f7, [
            new Connection(Field.m7, FieldConnection.DEFAULT),
            new Connection(Field.v8, FieldConnection.DEFAULT),
            new Connection(Field.t7, FieldConnection.DEFAULT),
        ]);

        fields.set(Field.v9, [
            new Connection(Field.f6, FieldConnection.DEFAULT),
            new Connection(Field.m8, FieldConnection.DEFAULT),
        ]);

        return fields;
    }
}

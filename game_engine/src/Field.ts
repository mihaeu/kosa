import { FieldName } from "./FieldName";
import { FieldType } from "./FieldType";

export class Field {
    public static readonly black = new Field(FieldName.black, FieldType.HOMEBASE);
    public static readonly blue = new Field(FieldName.blue, FieldType.HOMEBASE);
    public static readonly green = new Field(FieldName.green, FieldType.HOMEBASE);
    public static readonly purple = new Field(FieldName.purple, FieldType.HOMEBASE);
    public static readonly red = new Field(FieldName.red, FieldType.HOMEBASE);
    public static readonly white = new Field(FieldName.white, FieldType.HOMEBASE);
    public static readonly yellow = new Field(FieldName.yellow, FieldType.HOMEBASE);

    public static readonly F = new Field(FieldName.F, FieldType.FACTORY);

    public static readonly f1 = new Field(FieldName.f1, FieldType.FARM);
    public static readonly f2 = new Field(FieldName.f2, FieldType.FARM);
    public static readonly f3 = new Field(FieldName.f3, FieldType.FARM);
    public static readonly f4 = new Field(FieldName.f4, FieldType.FARM);
    public static readonly f5 = new Field(FieldName.f5, FieldType.FARM);
    public static readonly f6 = new Field(FieldName.f6, FieldType.FARM);
    public static readonly f7 = new Field(FieldName.f7, FieldType.FARM);

    public static readonly l1 = new Field(FieldName.l1, FieldType.LAKE);
    public static readonly l2 = new Field(FieldName.l2, FieldType.LAKE);
    public static readonly l3 = new Field(FieldName.l2, FieldType.LAKE);
    public static readonly l4 = new Field(FieldName.l4, FieldType.LAKE);
    public static readonly l5 = new Field(FieldName.l5, FieldType.LAKE);
    public static readonly l6 = new Field(FieldName.l6, FieldType.LAKE);
    public static readonly l7 = new Field(FieldName.l7, FieldType.LAKE);

    public static readonly m1 = new Field(FieldName.m1, FieldType.MOUNTAIN);
    public static readonly m2 = new Field(FieldName.m2, FieldType.MOUNTAIN);
    public static readonly m3 = new Field(FieldName.m3, FieldType.MOUNTAIN);
    public static readonly m4 = new Field(FieldName.m4, FieldType.MOUNTAIN);
    public static readonly m5 = new Field(FieldName.m5, FieldType.MOUNTAIN);
    public static readonly m6 = new Field(FieldName.m6, FieldType.MOUNTAIN);
    public static readonly m7 = new Field(FieldName.m7, FieldType.MOUNTAIN);
    public static readonly m8 = new Field(FieldName.m8, FieldType.MOUNTAIN);

    public static readonly t1 = new Field(FieldName.t1, FieldType.TUNDRA);
    public static readonly t2 = new Field(FieldName.t2, FieldType.TUNDRA);
    public static readonly t3 = new Field(FieldName.t3, FieldType.TUNDRA);
    public static readonly t4 = new Field(FieldName.t4, FieldType.TUNDRA);
    public static readonly t5 = new Field(FieldName.t5, FieldType.TUNDRA);
    public static readonly t6 = new Field(FieldName.t6, FieldType.TUNDRA);
    public static readonly t7 = new Field(FieldName.t7, FieldType.TUNDRA);
    public static readonly t8 = new Field(FieldName.t8, FieldType.TUNDRA);

    public static readonly v1 = new Field(FieldName.v1, FieldType.VILLAGE);
    public static readonly v2 = new Field(FieldName.v2, FieldType.VILLAGE);
    public static readonly v3 = new Field(FieldName.v3, FieldType.VILLAGE);
    public static readonly v4 = new Field(FieldName.v4, FieldType.VILLAGE);
    public static readonly v5 = new Field(FieldName.v5, FieldType.VILLAGE);
    public static readonly v6 = new Field(FieldName.v6, FieldType.VILLAGE);
    public static readonly v7 = new Field(FieldName.v7, FieldType.VILLAGE);
    public static readonly v8 = new Field(FieldName.v8, FieldType.VILLAGE);
    public static readonly v9 = new Field(FieldName.v9, FieldType.VILLAGE);

    public static readonly w1 = new Field(FieldName.w1, FieldType.FOREST);
    public static readonly w2 = new Field(FieldName.w2, FieldType.FOREST);
    public static readonly w3 = new Field(FieldName.w3, FieldType.FOREST);
    public static readonly w4 = new Field(FieldName.w4, FieldType.FOREST);
    public static readonly w5 = new Field(FieldName.w5, FieldType.FOREST);
    public static readonly w6 = new Field(FieldName.w6, FieldType.FOREST);
    public static readonly w7 = new Field(FieldName.w7, FieldType.FOREST);

    public static isNotLake(field: Field): boolean {
        return field.type !== FieldType.LAKE;
    }

    public static isNotHomeBase(field: Field): boolean {
        return field.type !== FieldType.HOMEBASE;
    }

    private constructor(private readonly name: FieldName, public readonly type: FieldType) {}

    public toString(): string {
        return `${this.name}:${this.type}`;
    }
}

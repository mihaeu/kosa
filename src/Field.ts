import {FieldType} from "./FieldType";

export class Field {
    public static readonly black = new Field("black", FieldType.HOMEBASE);
    public static readonly blue = new Field("blue", FieldType.HOMEBASE);
    public static readonly green = new Field("green", FieldType.HOMEBASE);
    public static readonly purple = new Field("purple", FieldType.HOMEBASE);
    public static readonly red = new Field("red", FieldType.HOMEBASE);
    public static readonly white = new Field("white", FieldType.HOMEBASE);
    public static readonly yellow = new Field("yellow", FieldType.HOMEBASE);
    public static readonly F = new Field("F", FieldType.FACTORY);
    public static readonly f1 = new Field("f1", FieldType.FARM);
    public static readonly f2 = new Field("f2", FieldType.FARM);
    public static readonly f3 = new Field("f3", FieldType.FARM);
    public static readonly f4 = new Field("f4", FieldType.FARM);
    public static readonly f5 = new Field("f5", FieldType.FARM);
    public static readonly f6 = new Field("f6", FieldType.FARM);
    public static readonly f7 = new Field("f7", FieldType.FARM);
    public static readonly l1 = new Field("l1", FieldType.LAKE);
    public static readonly l2 = new Field("l2", FieldType.LAKE);
    public static readonly l4 = new Field("l4", FieldType.LAKE);
    public static readonly l5 = new Field("l5", FieldType.LAKE);
    public static readonly l6 = new Field("l6", FieldType.LAKE);
    public static readonly l7 = new Field("l7", FieldType.LAKE);
    public static readonly m1 = new Field("m1", FieldType.MOUNTAIN);
    public static readonly m2 = new Field("m2", FieldType.MOUNTAIN);
    public static readonly m3 = new Field("m3", FieldType.MOUNTAIN);
    public static readonly m4 = new Field("m4", FieldType.MOUNTAIN);
    public static readonly m5 = new Field("m5", FieldType.MOUNTAIN);
    public static readonly m6 = new Field("m6", FieldType.MOUNTAIN);
    public static readonly m7 = new Field("m7", FieldType.MOUNTAIN);
    public static readonly m8 = new Field("m8", FieldType.MOUNTAIN);
    public static readonly t1 = new Field("t1", FieldType.TUNDRA);
    public static readonly t2 = new Field("t2", FieldType.TUNDRA);
    public static readonly t3 = new Field("t3", FieldType.TUNDRA);
    public static readonly t4 = new Field("t4", FieldType.TUNDRA);
    public static readonly t5 = new Field("t5", FieldType.TUNDRA);
    public static readonly t6 = new Field("t6", FieldType.TUNDRA);
    public static readonly t7 = new Field("t7", FieldType.TUNDRA);
    public static readonly t8 = new Field("t8", FieldType.TUNDRA);
    public static readonly v1 = new Field("v1", FieldType.VILLAGE);
    public static readonly v2 = new Field("v2", FieldType.VILLAGE);
    public static readonly v3 = new Field("v3", FieldType.VILLAGE);
    public static readonly v4 = new Field("v4", FieldType.VILLAGE);
    public static readonly v5 = new Field("v5", FieldType.VILLAGE);
    public static readonly v6 = new Field("v6", FieldType.VILLAGE);
    public static readonly v7 = new Field("v7", FieldType.VILLAGE);
    public static readonly v8 = new Field("v8", FieldType.VILLAGE);
    public static readonly v9 = new Field("v9", FieldType.VILLAGE);
    public static readonly w1 = new Field("w1", FieldType.FOREST);
    public static readonly w2 = new Field("w2", FieldType.FOREST);
    public static readonly w3 = new Field("w3", FieldType.FOREST);
    public static readonly w4 = new Field("w4", FieldType.FOREST);
    public static readonly w5 = new Field("w5", FieldType.FOREST);
    public static readonly w6 = new Field("w6", FieldType.FOREST);
    public static readonly w7 = new Field("w7", FieldType.FOREST);

    constructor(private readonly name: string, private type: FieldType) {
        this.name = name;
        this.type = type;
    }
}

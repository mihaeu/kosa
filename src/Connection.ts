import {Field} from "./Field";
import {FieldConnection} from "./FieldConnection";
import {FieldType} from "./FieldType";

export class Connection {
    constructor(public readonly field: Field, public readonly connectionType: FieldConnection) {
    }

    public static readonly isReachable = (connection: Connection) =>
        connection.connectionType === FieldConnection.DEFAULT
        || connection.connectionType === FieldConnection.TUNNEL

    public static readonly isNotLake = (connection: Connection) => connection.field.type !== FieldType.LAKE
}

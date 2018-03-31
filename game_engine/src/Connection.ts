import {Field} from "./Field";
import {FieldConnection} from "./FieldConnection";

export class Connection {
    public static readonly isReachable = (connection: Connection) => {
        return (
            connection.connectionType === FieldConnection.DEFAULT ||
            connection.connectionType === FieldConnection.TUNNEL
        );
    };

    constructor(public readonly field: Field, public readonly connectionType: FieldConnection) {}
}

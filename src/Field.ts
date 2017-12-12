import {FieldType} from "./FieldType";
import {FieldConnection} from "./FieldConnection";

export class Field {
    private connectedFields: Connection[] = [];

    constructor(private readonly name: string, private type: FieldType) {

    }

    connectField(field: Field, connection : FieldConnection) {
        this.connectedFields.push({field: field, connection: connection});
    }

    getConnectedFields() : Connection[] {
        return this.connectedFields;
    }
}


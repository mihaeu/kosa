"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FieldConnection_1 = require("./FieldConnection");
class Connection {
    constructor(field, connectionType) {
        this.field = field;
        this.connectionType = connectionType;
    }
}
Connection.isReachable = (connection) => connection.connectionType === FieldConnection_1.FieldConnection.DEFAULT
    || connection.connectionType === FieldConnection_1.FieldConnection.TUNNEL;
exports.Connection = Connection;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnitNotDeployedError extends Error {
    constructor(unit) {
        super(`${unit.name} has not been deployed yet.`);
    }
}
exports.UnitNotDeployedError = UnitNotDeployedError;

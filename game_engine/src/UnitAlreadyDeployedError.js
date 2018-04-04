"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnitAlreadyDeployedError extends Error {
    constructor(unit) {
        super(`${unit.name} has already been deployed.`);
    }
}
exports.UnitAlreadyDeployedError = UnitAlreadyDeployedError;

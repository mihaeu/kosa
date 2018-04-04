"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotEnoughPowerError extends Error {
    constructor(requiredPower, actualPower) {
        super(`${requiredPower} power required, but only ${actualPower} power available.`);
    }
}
exports.NotEnoughPowerError = NotEnoughPowerError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotEnoughCoinsError extends Error {
    constructor(requiredCoins, actualCoins) {
        super(`${requiredCoins} coin(s) required, but only ${actualCoins} coin(s) available.`);
    }
}
exports.NotEnoughCoinsError = NotEnoughCoinsError;

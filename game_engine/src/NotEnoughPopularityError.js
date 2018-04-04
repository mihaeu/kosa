"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotEnoughPopularityError extends Error {
    constructor(requiredPopularity, actualPopularity) {
        super(`${requiredPopularity} popularity required, but only ${actualPopularity} popularity available.`);
    }
}
exports.NotEnoughPopularityError = NotEnoughPopularityError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CannotHaveMoreThan20PopularityError extends Error {
    constructor() {
        super("Cannot have more than 20 popularity.");
    }
}
exports.CannotHaveMoreThan20PopularityError = CannotHaveMoreThan20PopularityError;

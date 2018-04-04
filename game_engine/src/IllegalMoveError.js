"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IllegalMoveError extends Error {
    constructor(unit, start, end) {
        super(`${unit} is not allowed to move from ${start} to ${end}.`);
    }
}
exports.IllegalMoveError = IllegalMoveError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BuildingAlreadyBuildError extends Error {
    constructor(building) {
        super(`Building ${building} has already been built.`);
    }
}
exports.BuildingAlreadyBuildError = BuildingAlreadyBuildError;

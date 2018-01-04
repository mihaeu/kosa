import {BuildingType} from "./BuildingType";

export class BuildingAlreadyBuildError extends Error {
    constructor(building: BuildingType) {
        super(`Building ${building} has already been built.`);
    }
}

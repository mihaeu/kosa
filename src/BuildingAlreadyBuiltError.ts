import {Building} from "./Building";

export class BuildingAlreadyBuildError extends Error {
    constructor(building: Building) {
        super(`Building ${building} has already been built.`);
    }
}

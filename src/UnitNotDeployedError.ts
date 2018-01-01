import {Unit} from "./Units/Unit";

export class UnitNotDeployedError extends Error {
    constructor(private readonly unit: Unit) {
        super(`${unit.name} has not been deployed yet.`);
    }
}

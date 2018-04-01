import { Unit } from "./Units/Unit";

export class UnitAlreadyDeployedError extends Error {
    constructor(private readonly unit: Unit) {
        super(`${unit.name} has already been deployed.`);
    }
}

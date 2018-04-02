export class NotEnoughPowerError extends Error {
    constructor(requiredPower: number, actualPower: number) {
        super(`${requiredPower} power required, but only ${actualPower} power available.`);
    }
}

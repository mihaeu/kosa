export class NotEnoughPowerError extends Error {
    constructor(private readonly requiredPower: number, private readonly actualPower: number) {
        super(`${requiredPower} power required, but only ${actualPower} power available.`);
    }
}

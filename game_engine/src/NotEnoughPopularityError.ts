export class NotEnoughPopularityError extends Error {
    constructor(private readonly requiredPopularity: number, private readonly actualPopularity: number) {
        super(`${requiredPopularity} popularity required, but only ${actualPopularity} popularity available.`);
    }
}

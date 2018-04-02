export class NotEnoughPopularityError extends Error {
    constructor(requiredPopularity: number, actualPopularity: number) {
        super(`${requiredPopularity} popularity required, but only ${actualPopularity} popularity available.`);
    }
}

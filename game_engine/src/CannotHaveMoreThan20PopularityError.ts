export class CannotHaveMoreThan20PopularityError extends Error {
    constructor() {
        super("Cannot have more than 20 popularity.");
    }
}

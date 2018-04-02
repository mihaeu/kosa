export class NotEnoughCoinsError extends Error {
    constructor(requiredCoins: number, actualCoins: number) {
        super(`${requiredCoins} coin(s) required, but only ${actualCoins} coin(s) available.`);
    }
}

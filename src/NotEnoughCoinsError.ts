export class NotEnoughCoinsError extends Error {
    constructor(private readonly requiredCoins: number, private readonly actualCoins: number) {
        super(`${requiredCoins} coin(s) required, but only ${actualCoins} coin(s) available.`);
    }
}
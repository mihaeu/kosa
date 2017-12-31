import * as _ from "ramda";

export interface Event {}

export class PowerEvent implements Event {
    constructor(public readonly power: number) {}
}

export class CoinEvent implements Event {
    constructor(public readonly coins: number) {}
}

export class NotEnoughCoinsError extends Error {
    constructor(requiredCoins: number, actualCoins: number) {
        super(`${requiredCoins} coin(s) required, but only ${actualCoins} coin(s) available.`);
    }
}

function sumEvents(payloadFn: (event: Event) => number, events: Event[]) {
    return _.reduce((sum: number, event: Event) => payloadFn(event) + sum, 0, events);
}

export class Player {
    private log: Event[] = [];

    constructor(coins: number = 0, power: number = 0) {
        this.log.push(new CoinEvent(coins));
        this.log.push(new PowerEvent(power));
    }

    public bolster(): Player {
        let coins = this.coins();
        if (coins < 1) {
            throw new NotEnoughCoinsError(1, coins);
        }

        this.log.push(new PowerEvent(+2));
        this.log.push(new CoinEvent(-1));
        return this;
    }

    public power(): number {
        return sumEvents((event: Event) => event instanceof PowerEvent ? event.power : 0, this.log);
    }

    public coins(): number {
        return sumEvents((event: Event) => event instanceof CoinEvent ? event.coins : 0, this.log);
    }
}

test("Player has two more power after bolster", () => {
    expect(new Player(2).bolster().bolster().power()).toBe(4);
});


test("Player pays one coin for bolster", () => {
    const player = new Player(1);
    expect(player.coins()).toBe(1);
    player.bolster();
    expect(player.coins()).toBe(0);
});

test("Player cannot bolster without coins", () => {
    const player = new Player(0);
    expect(() => player.bolster()).toThrowError(/1 coin\(s\) required, but only 0 coin\(s\) available./);
});

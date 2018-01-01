import * as _ from "ramda";

export interface Event {}

export class PowerEvent implements Event {
    constructor(public readonly power: number) {}
}

export class CoinEvent implements Event {
    constructor(public readonly coins: number) {}
}

export class CombatCardEvent implements Event {
    constructor(public readonly combatCard: CombatCard) {}
}

export class NotEnoughCoinsError extends Error {
    constructor(requiredCoins: number, actualCoins: number) {
        super(`${requiredCoins} coin(s) required, but only ${actualCoins} coin(s) available.`);
    }
}

function sumEvents(payloadFn: (event: Event) => number, events: Event[]) {
    return _.reduce((sum: number, event: Event) => payloadFn(event) + sum, 0, events);
}

export class CombatCard {
    constructor(public readonly value: 2|3|4|5) {}
}

export class Player {
    private log: Event[] = [];

    constructor(coins: number = 0, power: number = 0, combatCards: CombatCard[] = []) {
        this.log.push(new CoinEvent(coins));
        this.log.push(new PowerEvent(power));
        combatCards.forEach(combatCard => this.log.push(new CombatCardEvent(combatCard)))
    }

    public bolsterPower() {
        return this.bolster(new PowerEvent(+2));
    }

    public bolsterCombatCards() {
        return this.bolster(new CombatCardEvent(new CombatCard(2)));
    }

    private bolster(event: PowerEvent|CombatCardEvent): Player {
        let coins = this.coins();
        if (coins < 1) {
            throw new NotEnoughCoinsError(1, coins);
        }

        this.log.push(event);
        this.log.push(new CoinEvent(-1));
        return this;
    }

    public power(): number {
        return sumEvents((event: Event) => event instanceof PowerEvent ? event.power : 0, this.log);
    }

    public coins(): number {
        return sumEvents((event: Event) => event instanceof CoinEvent ? event.coins : 0, this.log);
    }

    public combatCards(): CombatCard[] {
        return _.map(event => event.combatCard, _.filter(event => event instanceof CombatCardEvent, this.log));
    }
}

test("Player has two more power after bolstering power", () => {
    expect(new Player(2).bolsterPower().bolsterPower().power()).toBe(4);
});

test("Player has one more combat card after bolstering combat cards", () => {
    const player = new Player(1);
    expect(player.combatCards().length).toBe(0);
    expect(player.bolsterCombatCards().combatCards().length).toBe(1);
});

test("Player pays one coin for bolster", () => {
    const player = new Player(1);
    expect(player.coins()).toBe(1);
    player.bolsterPower();
    expect(player.coins()).toBe(0);
});

test("Player cannot bolster without coins", () => {
    const player = new Player(0);
    expect(() => player.bolsterPower()).toThrowError(/1 coin\(s\) required, but only 0 coin\(s\) available./);
});

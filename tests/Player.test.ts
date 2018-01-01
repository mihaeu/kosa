import * as _ from "ramda";
import {Field} from "../src/Field";
import {Resource} from "../src/Resource";
import {GameMap} from "../src/GameMap";

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

export class MoveEvent implements Event {
    constructor(
        public readonly unit: Unit,
        public readonly destination: Field,
        public readonly resources: Resource[] = []
    ) {}
}

export class NotEnoughCoinsError extends Error {
    constructor(requiredCoins: number, actualCoins: number) {
        super(`${requiredCoins} coin(s) required, but only ${actualCoins} coin(s) available.`);
    }
}

export class UnitNotDeployedError extends Error {
    constructor(unit: Unit) {
        super(`${unit.name} has not been deployed yet.`);
    }
}

export class IllegalMoveError extends Error {
    constructor(unit: Unit, start: Field, end: Field) {
        super(`${unit} is not allowed to move from ${start} to ${end}.`);
    }
}

export class Unit {
    public static readonly CHARACTER = new Unit("CHARACTER", true);
    public static readonly MECH_1 = new Unit("MECH_1");
    public static readonly MECH_2 = new Unit("MECH_2");
    public static readonly MECH_3 = new Unit("MECH_3");
    public static readonly MECH_4 = new Unit("MECH_4");
    public static readonly WORKER_1 = new Unit("WORKER_1", true);
    public static readonly WORKER_2 = new Unit("WORKER_2", true);
    public static readonly WORKER_3 = new Unit("WORKER_3");
    public static readonly WORKER_4 = new Unit("WORKER_4");
    public static readonly WORKER_5 = new Unit("WORKER_5");
    public static readonly WORKER_6 = new Unit("WORKER_6");
    public static readonly WORKER_7 = new Unit("WORKER_7");
    public static readonly WORKER_8 = new Unit("WORKER_8");

    private constructor(public readonly name: string, public readonly deployed: boolean = false) {}

    public toString(): String {
        return  `${this.name}:${this.deployed ? 'deployed' : 'not deployed'}`;
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
        combatCards.forEach(combatCard => this.log.push(new CombatCardEvent(combatCard)));

        this.log.push(new MoveEvent(Unit.CHARACTER, Field.green));
        this.log.push(new MoveEvent(Unit.WORKER_1, Field.m1));
        this.log.push(new MoveEvent(Unit.WORKER_2, Field.f1));
    }

    public move(unit: Unit, destination: Field) {
        if (!unit.deployed) {
            throw new UnitNotDeployedError(unit);
        }
        let currentLocation = this.unitLocation(unit);
        if (!new GameMap().isReachable(currentLocation, destination)) {
            throw new IllegalMoveError(unit, currentLocation, destination);
        }
        this.log.push(new MoveEvent(unit, destination));
        return this;
    }

    public gainCoins(): Player {
        this.log.push(new CoinEvent(+1));
        return this;
    }

    public bolsterPower(): Player {
        return this.bolster(new PowerEvent(+2));
    }

    public bolsterCombatCards(): Player {
        return this.bolster(new CombatCardEvent(new CombatCard(2)));
    }

    public unitLocation(unit: Unit): Field {
        let moves = _.filter(event => event instanceof MoveEvent && event.unit === unit, this.log);
        return moves[moves.length - 1].destination;
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

test("Green character starts on green with two adjacent workers", () => {
    const player = new Player();
    expect(player.unitLocation(Unit.CHARACTER)).toBe(Field.green);
    expect(player.unitLocation(Unit.WORKER_1)).toBe(Field.m1);
    expect(player.unitLocation(Unit.WORKER_2)).toBe(Field.f1);
});

test("Green character can move from base to encounter on v1 in 2 moves", () => {
    const player = new Player();
    player.move(Unit.CHARACTER, Field.f1);
    expect(player.unitLocation(Unit.CHARACTER)).toBe(Field.f1);
    player.move(Unit.CHARACTER, Field.v1);
    expect(player.unitLocation(Unit.CHARACTER)).toBe(Field.v1);
});

test("Player cannot move a mech which has not been deployed", () => {
    const expectedError = /MECH_1 has not been deployed yet./;
    expect(() => new Player().move(Unit.MECH_1, Field.black)).toThrowError(expectedError);
});

test("Green character cannot move to another homebase", () => {
    const expectedError = /CHARACTER:deployed is not allowed to move from green:HOMEBASE to black:HOMEBASE./;
    expect(() => new Player().move(Unit.CHARACTER, Field.black)).toThrowError(expectedError);
});

test("Player can gain one coin", () => {
    const player = new Player();
    expect(player.coins()).toBe(0);
    player.gainCoins();
    expect(player.coins()).toBe(1);
});
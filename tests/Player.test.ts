import {Field} from "../src/Field";
import {Player} from "../src/Player";
import {Unit} from "../src/Unit";

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
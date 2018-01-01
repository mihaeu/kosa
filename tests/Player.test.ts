import {Field} from "../src/Field";
import {Player} from "../src/Player";
import {Character} from "../src/Units/Character";
import {Mech} from "../src/Units/Mech";
import {Worker} from "../src/Units/Worker";
import {Resource} from "../src/Resource";
import {Building} from "../src/Building";

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
    expect(player.unitLocation(Character.CHARACTER)).toBe(Field.green);
    expect(player.unitLocation(Worker.WORKER_1)).toBe(Field.m1);
    expect(player.unitLocation(Worker.WORKER_2)).toBe(Field.f1);
});

test("Green character can move from base to encounter on v1 in 2 moves", () => {
    const player = new Player();
    player.move(Character.CHARACTER, Field.f1);
    expect(player.unitLocation(Character.CHARACTER)).toBe(Field.f1);
    player.move(Character.CHARACTER, Field.v1);
    expect(player.unitLocation(Character.CHARACTER)).toBe(Field.v1);
});

test("Player cannot move a mech which has not been deployed", () => {
    const expectedError = /MECH_1 has not been deployed yet./;
    expect(() => new Player().move(Mech.MECH_1, Field.black)).toThrowError(expectedError);
});

test("Green character cannot move to another homebase", () => {
    const expectedError = /CHARACTER is not allowed to move from green:HOMEBASE to black:HOMEBASE./;
    expect(() => new Player().move(Character.CHARACTER, Field.black)).toThrowError(expectedError);
});

test("Player can gain one coin", () => {
    const player = new Player();
    expect(player.coins()).toBe(0);
    player.gainCoins();
    expect(player.coins()).toBe(1);
});

test("Trade requires coins", () => {
    const expectedError = /1 coin.s. required, but only 0 coin.s. available./;
    expect(() => new Player().trade(Worker.WORKER_1, Resource.FOOD, Resource.FOOD)).toThrowError(expectedError);
});

test("Trade requires a deployed worker", () => {
    const expectedError = /WORKER_3 has not been deployed yet./;
    expect(() => new Player(1).trade(Worker.WORKER_3, Resource.FOOD, Resource.FOOD)).toThrowError(expectedError);
});

test("Player has two more resources after trade", () => {
    let resources = new Player(1).trade(Worker.WORKER_1, Resource.WOOD, Resource.METAL).resources();
    expect(resources.food).toBe(0);
    expect(resources.wood).toBe(1);
    expect(resources.metal).toBe(1);
    expect(resources.oil).toBe(0);
});

test("Cannot build the same building twice", () => {
    const expectedError = /Building MILL has already been built./;
    expect(() => {
        new Player().build(Worker.WORKER_1, Building.MILL).build(Worker.WORKER_1, Building.MILL)
    }).toThrowError(expectedError);
});

test("Cannot build on a location that already has a building", () => {
    const expectedError = /m1.MOUNTAIN already has another building./;
    expect(() => {
        new Player().build(Worker.WORKER_1, Building.MILL).build(Worker.WORKER_1, Building.ARMORY)
    }).toThrowError(expectedError);
});

import {Field} from "../src/Field";
import {Player} from "../src/Player";
import {Character} from "../src/Units/Character";
import {Mech} from "../src/Units/Mech";
import {Worker} from "../src/Units/Worker";
import {ResourceType} from "../src/ResourceType";
import {BuildingType} from "../src/BuildingType";
import {EventLog} from "../src/Events/EventLog";
import {GainResourceEvent} from "../src/Events/GainResourceEvent";
import {Resource} from "../src/Resource";
import {SpendResourceEvent} from "../src/Events/SpendResourceEvent";
import {Building} from "../src/Building";
import {PlayerMat} from "../src/PlayerMat";
import {Faction} from "../src/Faction";
import {PlayerFactory} from "../src/PlayerFactory";
import {CoinEvent} from "../src/Events/CoinEvent";
import {MoveEvent} from "../src/Events/MoveEvent";
import {Unit} from "../src/Units/Unit";
import {ActionEvent} from "../src/Events/ActionEvent";
import {TopAction} from "../src/TopAction";

let testPlayer: Player;

// 1 power, 4 combat cards, 4 popularity, 7 coins
beforeEach(() => testPlayer = PlayerFactory.black(PlayerMat.agricultural()));

test("Black player has two more power after bolstering power", () => {
    expect(testPlayer.bolsterPower().power()).toBe(3);
});

test("Player has one more combat card after bolstering combat cards", () => {
    expect(testPlayer.combatCards().length).toBe(4);
    expect(testPlayer.bolsterCombatCards().combatCards().length).toBe(5);
});

test("Player pays one coin for bolster", () => {
    expect(testPlayer.coins()).toBe(7);
    expect(testPlayer.bolsterPower().coins()).toBe(6);
});

test("Player cannot bolster without coins", () => {
    testPlayer.addEvent(new CoinEvent(-7));
    expect(() => testPlayer.bolsterPower()).toThrowError(/1 coin\(s\) required, but only 0 coin\(s\) available./);
});

test("Green character starts on green with two adjacent workers", () => {
    expect(testPlayer.unitLocation(Character.CHARACTER)).toBe(Field.green);
    expect(testPlayer.unitLocation(Worker.WORKER_1)).toBe(Field.m1);
    expect(testPlayer.unitLocation(Worker.WORKER_2)).toBe(Field.f1);
});

test("Green character can move from base to encounter on v1 in 2 moves", () => {
    testPlayer.move(Character.CHARACTER, Field.f1);
    expect(testPlayer.unitLocation(Character.CHARACTER)).toBe(Field.f1);
    testPlayer.produce();
    testPlayer.move(Character.CHARACTER, Field.v1);
    expect(testPlayer.unitLocation(Character.CHARACTER)).toBe(Field.v1);
});

test("Player cannot move a mech which has not been deployed", () => {
    const expectedError = /MECH_1 has not been deployed yet./;
    expect(() => testPlayer.move(Mech.MECH_1, Field.black)).toThrowError(expectedError);
});

test("Green character cannot move to another homebase", () => {
    const expectedError = /CHARACTER is not allowed to move from green:HOMEBASE to black:HOMEBASE./;
    expect(() => testPlayer.move(Character.CHARACTER, Field.black)).toThrowError(expectedError);
});

test("Player can gain one coin", () => {
    expect(testPlayer.coins()).toBe(7);
    expect(testPlayer.gainCoins().coins()).toBe(8);
});

test("Calculate resources", () => {
    let log = new EventLog()
        .add(new GainResourceEvent([
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
        ]))
        .add(new SpendResourceEvent([
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
        ])
    );
    const player = new Player(log, Faction.GREEN, PlayerMat.industrial());

    expect(player.resources().food).toBe(2);
});

test("Trade requires coins", () => {
    const expectedError = /1 coin.s. required, but only 0 coin.s. available./;
    expect(() => testPlayer
        .addEvent(new CoinEvent(-7))
        .tradeResources(Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)).toThrowError(expectedError);
});

test("Trade requires a deployed worker", () => {
    const expectedError = /WORKER_3 has not been deployed yet./;
    expect(() => testPlayer.tradeResources(Worker.WORKER_3, ResourceType.FOOD, ResourceType.FOOD)).toThrowError(expectedError);
});

test("Player has two more resources after tradeResources", () => {
    let resources = testPlayer.tradeResources(Worker.WORKER_1, ResourceType.WOOD, ResourceType.METAL).resources();
    expect(resources.food).toBe(0);
    expect(resources.wood).toBe(1);
    expect(resources.metal).toBe(1);
    expect(resources.oil).toBe(0);
    expect(testPlayer.coins()).toBe(6);
});

test("Cannot build the same building twice", () => {
    const resources = [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    const player = new Player(new EventLog().add(new GainResourceEvent(resources)), Faction.GREEN, PlayerMat.industrial());

    const expectedError = /Building MILL has already been built./;
    expect(() => {
        player
            .build(Worker.WORKER_1, BuildingType.MILL, resources)
            .addEvent(new ActionEvent(TopAction.MOVE))
            .build(Worker.WORKER_1, BuildingType.MILL, resources)
    }).toThrowError(expectedError);
});

test("Cannot build on a location that already has a building", () => {
    const resources1 = [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    const resources2 = [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    const log = new EventLog().add(new GainResourceEvent(resources1)).add(new GainResourceEvent(resources2));
    const player = new Player(log, Faction.GREEN, PlayerMat.industrial());
    const expectedError = /m1.MOUNTAIN already has another building./;
    expect(() => {
        player
            .build(Worker.WORKER_1, BuildingType.MILL, resources1)
            .addEvent(new ActionEvent(TopAction.MOVE))
            .build(Worker.WORKER_1, BuildingType.ARMORY, resources2)
    }).toThrowError(expectedError);
});

test("Cannot build without enough wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => testPlayer.build(Worker.WORKER_1, BuildingType.ARMORY, [])).toThrowError(expectedError);
});

test("Accepts only exact wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => testPlayer.build(Worker.WORKER_1, BuildingType.ARMORY, [])).toThrowError(expectedError);
});

test("Player can build a mill", () => {
    const resources = [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    const player = new Player(
        new EventLog().add(new GainResourceEvent(resources)),
        Faction.GREEN,
        PlayerMat.industrial()
    );
    player.build(Worker.WORKER_1, BuildingType.MILL, resources);

    expect(player.resources().countByType(ResourceType.WOOD)).toBe(0);
    expect(player.buildings().pop()).toEqual(new Building(BuildingType.MILL, Field.m1));
});

test("Building uses specific resources", () => {
    const resources1 = [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.f1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    const resources2 = [
        new Resource(Field.f1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    const player = new Player(
        new EventLog().add(new GainResourceEvent(resources1.concat(resources2))),
        Faction.GREEN,
        PlayerMat.industrial()
    );
    expect(player.availableResources()).toEqual(resources1.concat(resources2));

    player.build(Worker.WORKER_1, BuildingType.MILL, resources1);
    expect(player.availableResources()).toEqual(resources2);
});

test("Paying resources requires exact match", () => {
    const resources1 = [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.f1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    const resources2 = [
        new Resource(Field.f2, ResourceType.WOOD),
        new Resource(Field.f2, ResourceType.WOOD),
        new Resource(Field.f2, ResourceType.WOOD),
    ];
    const player = new Player(
        new EventLog().add(new GainResourceEvent(resources1)),
        Faction.GREEN,
        PlayerMat.industrial()
    );

    const expectedError = /The provided resources \(m1:MOUNTAIN:WOOD, f1:FARM:WOOD, m1:MOUNTAIN:WOOD\) are not among your available resources \(f2:FARM:WOOD, f2:FARM:WOOD, f2:FARM:WOOD\)./;
    expect(() => player.build(Worker.WORKER_1, BuildingType.MILL, resources2)).toThrowError(expectedError);
});

test("Can trade for popularity", () => {
    expect(testPlayer.tradePopularity().popularity()).toBe(5);
});

test("Black cannot take the same top action twice", () => {
    expect(() => testPlayer.produce().produce()).toThrowError("Cannot use the same action twice.");
});

test("Top action and bottom action have to match", () => {
    expect(() => testPlayer
        .produce()
        .enlist())
        .toThrowError("Cannot use this bottom action with the last top action.");
});

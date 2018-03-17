import {Field} from "../src/Field";
import {Game} from "../src/Game";
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
import {PlayerId} from "../src/PlayerId";
import {Player} from "../src/Player";

let game: Game;
const playerId = new PlayerId(1);

// 1 power, 4 combat cards, 4 popularity, 7 coins
const player = PlayerFactory.black(playerId, PlayerMat.agricultural(playerId));

beforeEach(() => {
    game = new Game(
        new EventLog(),
        [player],
    );
});

test("Black player has two more power after bolstering power", () => {
    expect(game.bolsterPower(player).power(player)).toBe(3);
});

test("Player has one more combat card after bolstering combat cards", () => {
    expect(game.combatCards(player).length).toBe(4);
    expect(game.bolsterCombatCards(player).combatCards(player).length).toBe(5);
});

test("Player pays one coin for bolster", () => {
    expect(game.coins(player)).toBe(7);
    expect(game.bolsterPower(player).coins(player)).toBe(6);
});

test("Player cannot bolster without coins", () => {
    game.addEvent(new CoinEvent(player.playerId, -7));
    expect(() => game.bolsterPower(player)).toThrowError(/1 coin\(s\) required, but only 0 coin\(s\) available./);
});

test("Black character starts on black with two adjacent workers", () => {
    expect(game.unitLocation(player, Character.CHARACTER)).toBe(Field.black);
    expect(game.unitLocation(player, Worker.WORKER_1)).toBe(Field.m6);
    expect(game.unitLocation(player, Worker.WORKER_2)).toBe(Field.t8);
});

test("Black character can move from base to encounter on v6 in 2 moves", () => {
    game.move(player, Character.CHARACTER, Field.m6);
    expect(game.unitLocation(player, Character.CHARACTER)).toBe(Field.m6);
    game.produce(player);
    game.move(player, Character.CHARACTER, Field.v6);
    expect(game.unitLocation(player, Character.CHARACTER)).toBe(Field.v6);
});

test("Player cannot move a mech which has not been deployed", () => {
    const expectedError = /MECH_1 has not been deployed yet./;
    expect(() => game.move(player, Mech.MECH_1, Field.black)).toThrowError(expectedError);
});

test("Black character cannot move to another homebase", () => {
    const expectedError = /CHARACTER is not allowed to move from black:HOMEBASE to green:HOMEBASE./;
    expect(() => game.move(player, Character.CHARACTER, Field.green)).toThrowError(expectedError);
});

test("Player can gain one coin", () => {
    expect(game.coins(player)).toBe(7);
    expect(game.gainCoins(player).coins(player)).toBe(8);
});

test("Calculate resources", () => {
    let log = new EventLog()
        .add(new GainResourceEvent(playerId, [
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
        ]))
        .add(new SpendResourceEvent(playerId, [
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
        ])
    );
    const player = new Player(playerId, Faction.GREEN, PlayerMat.industrial(playerId));
    const game = new Game(log, [player]);
    expect(game.resources(player).food).toBe(2);
});

test("Trade requires coins", () => {
    const expectedError = /1 coin.s. required, but only 0 coin.s. available./;
    expect(() => game
        .addEvent(new CoinEvent(playerId, -7))
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)).toThrowError(expectedError);
});

test("Trade requires a deployed worker", () => {
    const expectedError = /WORKER_3 has not been deployed yet./;
    expect(() => game.tradeResources(player, Worker.WORKER_3, ResourceType.FOOD, ResourceType.FOOD)).toThrowError(expectedError);
});

test("Player has two more resources after tradeResources", () => {
    let resources = game.tradeResources(player, Worker.WORKER_1, ResourceType.WOOD, ResourceType.METAL).resources(player);
    expect(resources.food).toBe(0);
    expect(resources.wood).toBe(1);
    expect(resources.metal).toBe(1);
    expect(resources.oil).toBe(0);
    expect(game.coins(player)).toBe(6);
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
    game.addEvent(new GainResourceEvent(playerId, resources));

    const expectedError = /Building MILL has already been built./;
    expect(() => {
        game
            .build(player, Worker.WORKER_1, BuildingType.MILL, resources)
            .produce(player)
            .build(player, Worker.WORKER_1, BuildingType.MILL, resources);
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
    game.addEvent(new GainResourceEvent(playerId, resources1));
    game.addEvent(new GainResourceEvent(playerId, resources2));
    const expectedError = /m6.MOUNTAIN already has another building./;
    expect(() => {
        game
            .build(player, Worker.WORKER_1, BuildingType.MILL, resources1)
            .produce(player)
            .build(player, Worker.WORKER_1, BuildingType.ARMORY, resources2)
    }).toThrowError(expectedError);
});

test("Cannot build without enough wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => game.build(player, Worker.WORKER_1, BuildingType.ARMORY, [])).toThrowError(expectedError);
});

test("Accepts only exact wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => game.build(player, Worker.WORKER_1, BuildingType.ARMORY, [])).toThrowError(expectedError);
});

test("Player can build a mill", () => {
    const resources = [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    game.addEvent(new GainResourceEvent(playerId, resources));
    game.build(player, Worker.WORKER_1, BuildingType.MILL, resources);

    expect(game.resources(player).countByType(ResourceType.WOOD)).toBe(0);
    expect(game.buildings(player).pop()).toEqual(new Building(BuildingType.MILL, Field.m6));
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
    game.addEvent(new GainResourceEvent(playerId, resources1.concat(resources2)));
    expect(game.availableResources(player)).toEqual(resources1.concat(resources2));

    game.build(player, Worker.WORKER_1, BuildingType.MILL, resources1);
    expect(game.availableResources(player)).toEqual(resources2);
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

    game.addEvent(new GainResourceEvent(playerId, resources1));

    const expectedError = /The provided resources \(m1:MOUNTAIN:WOOD, f1:FARM:WOOD, m1:MOUNTAIN:WOOD\) are not among your available resources \(f2:FARM:WOOD, f2:FARM:WOOD, f2:FARM:WOOD\)./;
    expect(() => game.build(player, Worker.WORKER_1, BuildingType.MILL, resources2)).toThrowError(expectedError);
});

test("Can trade for popularity", () => {
    expect(game.tradePopularity(player).popularity(player)).toBe(5);
});

test("Black cannot take the same top action twice", () => {
    expect(() => game.produce(player).produce(player)).toThrowError("Cannot use the same action twice.");
});

test("Top action and bottom action have to match", () => {
    expect(() => game
        .produce(player)
        .enlist(player))
        .toThrowError("Cannot use this bottom action with the last top action.");
});

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
import {BottomAction} from "../src/BottomAction";
import {RecruitReward} from "../src/RecruitReward";
import {DeployEvent} from "../src/Events/DeployEvent";
import _ = require("ramda");

let game: Game;

const blackIndustrialPlayerId = new PlayerId(1);
const greenAgriculturalPlayerId = new PlayerId(2);

const blackIndustrialPlayer = PlayerFactory.black(
    blackIndustrialPlayerId,
    PlayerMat.industrial(blackIndustrialPlayerId)
);
const greenAgriculturalPlayer = PlayerFactory.green(
    greenAgriculturalPlayerId,
    PlayerMat.agricultural(greenAgriculturalPlayerId)
);

beforeEach(() => {
    game = new Game(
        new EventLog(),
        [blackIndustrialPlayer, greenAgriculturalPlayer],
    );
});

test("Black player has two more power after bolstering power", () => {
    expect(game.bolsterPower(blackIndustrialPlayer).power(blackIndustrialPlayer)).toBe(3);
});

test("Player has one more combat card after bolstering combat cards", () => {
    expect(game.combatCards(blackIndustrialPlayer).length).toBe(4);
    expect(game.bolsterCombatCards(blackIndustrialPlayer).combatCards(blackIndustrialPlayer).length).toBe(5);
});

test("Player pays one coin for bolster", () => {
    expect(game.coins(blackIndustrialPlayer)).toBe(4);
    expect(game.bolsterPower(blackIndustrialPlayer).coins(blackIndustrialPlayer)).toBe(3);
});

test("Player cannot bolster without coins", () => {
    game.addEvent(new CoinEvent(blackIndustrialPlayer.playerId, -4));
    expect(() => game.bolsterPower(blackIndustrialPlayer)).toThrowError(/1 coin\(s\) required, but only 0 coin\(s\) available./);
});

test("Black character starts on black with two adjacent workers", () => {
    expect(game.unitLocation(blackIndustrialPlayer, Character.CHARACTER)).toBe(Field.black);
    expect(game.unitLocation(blackIndustrialPlayer, Worker.WORKER_1)).toBe(Field.m6);
    expect(game.unitLocation(blackIndustrialPlayer, Worker.WORKER_2)).toBe(Field.t8);
});

test("Black character can move from base to encounter on v6 in 2 moves (3 turns)", () => {
    game.move(blackIndustrialPlayer, Character.CHARACTER, Field.m6);
    expect(game.unitLocation(blackIndustrialPlayer, Character.CHARACTER)).toBe(Field.m6);
    game.produce(greenAgriculturalPlayer);

    game.produce(blackIndustrialPlayer);
    game.bolsterPower(greenAgriculturalPlayer);

    game.move(blackIndustrialPlayer, Character.CHARACTER, Field.v6);
    expect(game.unitLocation(blackIndustrialPlayer, Character.CHARACTER)).toBe(Field.v6);
});

test("Player cannot move a mech which has not been deployed", () => {
    const expectedError = /MECH_1 has not been deployed yet./;
    expect(() => game.move(blackIndustrialPlayer, Mech.MECH_1, Field.black)).toThrowError(expectedError);
});

test("Black character cannot move to another homebase", () => {
    const expectedError = /CHARACTER is not allowed to move from black:HOMEBASE to green:HOMEBASE./;
    expect(() => game.move(blackIndustrialPlayer, Character.CHARACTER, Field.green)).toThrowError(expectedError);
});

test("Player can gain one coin", () => {
    expect(game.coins(blackIndustrialPlayer)).toBe(4);
    expect(game.gainCoins(blackIndustrialPlayer).coins(blackIndustrialPlayer)).toBe(5);
});

test("Calculate resources", () => {
    let log = new EventLog()
        .add(new GainResourceEvent(blackIndustrialPlayerId, [
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
            new Resource(Field.F, ResourceType.FOOD),
        ]))
        .add(new SpendResourceEvent(blackIndustrialPlayerId, [
                new Resource(Field.F, ResourceType.FOOD),
                new Resource(Field.F, ResourceType.FOOD),
                new Resource(Field.F, ResourceType.FOOD),
            ])
        );
    const player = new Player(blackIndustrialPlayerId, Faction.GREEN, PlayerMat.industrial(blackIndustrialPlayerId));
    const game = new Game(log, [player]);
    expect(game.resources(player).food).toBe(2);
});

test("Trade requires coins", () => {
    const expectedError = /1 coin.s. required, but only 0 coin.s. available./;
    expect(() => game
        .addEvent(new CoinEvent(blackIndustrialPlayerId, -4))
        .tradeResources(blackIndustrialPlayer, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)).toThrowError(expectedError);
});

test("Trade requires a deployed worker", () => {
    const expectedError = /WORKER_3 has not been deployed yet./;
    expect(() => game.tradeResources(blackIndustrialPlayer, Worker.WORKER_3, ResourceType.FOOD, ResourceType.FOOD)).toThrowError(expectedError);
});

test("Player has two more resources after tradeResources", () => {
    let resources = game.tradeResources(blackIndustrialPlayer, Worker.WORKER_1, ResourceType.WOOD, ResourceType.METAL).resources(blackIndustrialPlayer);
    expect(resources.food).toBe(0);
    expect(resources.wood).toBe(1);
    expect(resources.metal).toBe(1);
    expect(resources.oil).toBe(0);
    expect(game.coins(blackIndustrialPlayer)).toBe(3);
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
    game.addEvent(new GainResourceEvent(blackIndustrialPlayerId, resources));

    const expectedError = /Building MILL has already been built./;
    expect(() => {
        game
            .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources)
            .bolsterPower(greenAgriculturalPlayer)
            .produce(blackIndustrialPlayer)
            .gainCoins(greenAgriculturalPlayer)
            .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources);
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
    game.addEvent(new GainResourceEvent(blackIndustrialPlayerId, resources1));
    game.addEvent(new GainResourceEvent(blackIndustrialPlayerId, resources2));

    expect(() => {
        game
            .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources1)
            .bolsterPower(greenAgriculturalPlayer)
            .bolsterPower(blackIndustrialPlayer)
            .produce(greenAgriculturalPlayer)
            .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.ARMORY, resources2)
    }).toThrowError(/m6.MOUNTAIN already has another building./);
});

test("Cannot build without enough wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => game
        .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.ARMORY, []))
        .toThrowError(expectedError);
});

test("Accepts only exact wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => game
        .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.ARMORY, []))
        .toThrowError(expectedError);
});

test("Player can build a mill", () => {
    const resources = [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ];
    game.addEvent(new GainResourceEvent(blackIndustrialPlayerId, resources));
    game.build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources);

    expect(game.resources(blackIndustrialPlayer).countByType(ResourceType.WOOD)).toBe(0);
    expect(game.buildings(blackIndustrialPlayer).pop()).toEqual(new Building(BuildingType.MILL, Field.m6));
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
    game.addEvent(new GainResourceEvent(blackIndustrialPlayerId, resources1.concat(resources2)));
    expect(game.availableResources(blackIndustrialPlayer)).toEqual(resources1.concat(resources2));

    game.build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources1);
    expect(game.availableResources(blackIndustrialPlayer)).toEqual(resources2);
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

    game.addEvent(new GainResourceEvent(blackIndustrialPlayerId, resources1));

    const expectedError = /The provided resources \(m1:MOUNTAIN:WOOD, f1:FARM:WOOD, m1:MOUNTAIN:WOOD\) are not among your available resources \(f2:FARM:WOOD, f2:FARM:WOOD, f2:FARM:WOOD\)./;
    expect(() => game
        .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources2)
    ).toThrowError(expectedError);
});

test("Can trade for popularity", () => {
    expect(game.tradePopularity(blackIndustrialPlayer).popularity(blackIndustrialPlayer)).toBe(3);
});

test("Black cannot take the same top action twice", () => {
    expect(() => game
        .produce(blackIndustrialPlayer)
        .produce(greenAgriculturalPlayer)
        .produce(blackIndustrialPlayer)
    ).toThrowError("Cannot use actions from the same column.");
});

test("Black cannot take bottom action from the same column as last turn's top action", () => {
    expect(() => game
        .produce(blackIndustrialPlayer)
        .produce(greenAgriculturalPlayer)
        .deploy(blackIndustrialPlayer, Worker.WORKER_1, Mech.MECH_1, [])
    ).toThrowError("Cannot use actions from the same column.");
});

test("Black cannot take top action from the same column as last turn's bottom action", () => {
    const resources = [
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.m6, ResourceType.METAL),
    ];
    game.addEvent(new GainResourceEvent(blackIndustrialPlayerId, resources));

    expect(() => game
        .deploy(blackIndustrialPlayer, Worker.WORKER_1, Mech.MECH_1, resources)
        .produce(greenAgriculturalPlayer)
        .produce(blackIndustrialPlayer)
    ).toThrowError("Cannot use actions from the same column.");
});

test("Top action and bottom action have to match", () => {
    expect(() => game
        .produce(blackIndustrialPlayer)
        .enlist(blackIndustrialPlayer, BottomAction.BUILD, RecruitReward.COINS, [])
    ).toThrowError("Cannot use this bottom action with the last top action.");
});

test("Player with industrial (1) map starts before agricultural (7)", () => {
    expect(() => game
        .produce(greenAgriculturalPlayer)
    ).toThrowError("You are not the starting player.");
});

test("Player cannot play out of order", () => {
    expect(() => game
        .gainCoins(blackIndustrialPlayer)
        .bolsterPower(blackIndustrialPlayer)
    ).toThrowError("It is not your turn yet.");
});

test("Players can take all available top actions at the start of the game", () => {
    expect(game.availableTopActions(blackIndustrialPlayer).length).toBe(4);
});

test("Players don't have available actions when it's not their turn", () => {
    game.bolsterPower(blackIndustrialPlayer);
    expect(game.availableTopActions(blackIndustrialPlayer).length).toBe(0);
});

test("Players have three available actions on their second turn", () => {
    game
        .bolsterPower(blackIndustrialPlayer)
        .bolsterPower(greenAgriculturalPlayer);
    expect(game.availableTopActions(blackIndustrialPlayer).length).toBe(3);
});

test.skip("Black producing at starting position will get 1 oil and 1 metal", () => {
    game.produce(blackIndustrialPlayer);
    expect(game.availableResources(blackIndustrialPlayer)).toEqual([
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.t8, ResourceType.OIL),
    ]);
});

test.skip("Producing with 8 workers costs 1 popularity, 1 coins, 1 power", () => {
    game
        .addEvent(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.t8))
        .addEvent(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.t8))
        .addEvent(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_5, Field.t8))
        .addEvent(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_6, Field.t8))
        .addEvent(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_7, Field.t8))
        .addEvent(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_8, Field.t8));

    game.produce(blackIndustrialPlayer);
    expect(game.availableResources(blackIndustrialPlayer)).toEqual([
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
    ]);
    expect(game.power(blackIndustrialPlayer)).toBe(0);
    expect(game.popularity(blackIndustrialPlayer)).toBe(1);
    expect(game.coins(blackIndustrialPlayer)).toBe(3);
});

test.skip("Cannot deploy the same mech twice", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer, Field.t8);

    expect(() => game
        .deploy(blackIndustrialPlayer, Worker.WORKER_1, Mech.MECH_1, resourcesFrom(4, Field.t8, ResourceType.METAL))
        .bolsterPower(greenAgriculturalPlayer)
        .bolsterPower(blackIndustrialPlayer)
        .tradePopularity(greenAgriculturalPlayer)
        .deploy(blackIndustrialPlayer, Worker.WORKER_1, Mech.MECH_1, resourcesFrom(4, Field.t8, ResourceType.METAL))
    ).toThrowError("Mech already deployed.");
});

test.skip("Buildings cannot be placed on home territories", () => fail());
test.skip("Buildings cannot be placed on lakes", () => fail());
test.skip("Cannot move the same unit multiple times", () => fail());

const resources = (location: Field, resourceType: ResourceType): Resource[] => {
    return _.map(() => new Resource(location, resourceType),_.range(10));
};

const mockResourcesAndCoinsForPlayer = (player: Player, location: Field) => {
    game
        .addEvent(new GainResourceEvent(player.playerId, resources(location, ResourceType.METAL)))
        .addEvent(new GainResourceEvent(player.playerId, resources(location, ResourceType.WOOD)))
        .addEvent(new GainResourceEvent(player.playerId, resources(location, ResourceType.OIL)))
        .addEvent(new GainResourceEvent(player.playerId, resources(location, ResourceType.FOOD)))
        .addEvent(new CoinEvent(player.playerId, 10))
    ;
};

const resourcesFrom = (amount: number, location: Field, resourceType: ResourceType): Resource[] => {
    return _.map(() => new Resource(location, resourceType), _.range(amount));
};

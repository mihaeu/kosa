"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("ramda");
const Availability_1 = require("../src/Availability");
const BottomAction_1 = require("../src/BottomAction");
const Building_1 = require("../src/Building");
const BuildingType_1 = require("../src/BuildingType");
const BuildEvent_1 = require("../src/Events/BuildEvent");
const CoinEvent_1 = require("../src/Events/CoinEvent");
const DeployEvent_1 = require("../src/Events/DeployEvent");
const EnlistEvent_1 = require("../src/Events/EnlistEvent");
const EventLog_1 = require("../src/Events/EventLog");
const GainResourceEvent_1 = require("../src/Events/GainResourceEvent");
const PassEvent_1 = require("../src/Events/PassEvent");
const PopularityEvent_1 = require("../src/Events/PopularityEvent");
const PowerEvent_1 = require("../src/Events/PowerEvent");
const SpendResourceEvent_1 = require("../src/Events/SpendResourceEvent");
const StarEvent_1 = require("../src/Events/StarEvent");
const UpgradeEvent_1 = require("../src/Events/UpgradeEvent");
const Field_1 = require("../src/Field");
const Game_1 = require("../src/Game");
const GameInfo_1 = require("../src/GameInfo");
const Move_1 = require("../src/Move");
const PlayerFactory_1 = require("../src/PlayerFactory");
const PlayerMat_1 = require("../src/PlayerMat");
const RecruitReward_1 = require("../src/RecruitReward");
const Resource_1 = require("../src/Resource");
const ResourceType_1 = require("../src/ResourceType");
const Star_1 = require("../src/Star");
const TopAction_1 = require("../src/TopAction");
const Character_1 = require("../src/Units/Character");
const Mech_1 = require("../src/Units/Mech");
const Worker_1 = require("../src/Units/Worker");
let game;
const blackIndustrialPlayerId = "1";
const greenAgriculturalPlayerId = "2";
const blackIndustrialPlayer = PlayerFactory_1.PlayerFactory.black(blackIndustrialPlayerId, PlayerMat_1.PlayerMat.industrial(blackIndustrialPlayerId));
const greenAgriculturalPlayer = PlayerFactory_1.PlayerFactory.green(greenAgriculturalPlayerId, PlayerMat_1.PlayerMat.agricultural(greenAgriculturalPlayerId));
const testPlayers = [blackIndustrialPlayer, greenAgriculturalPlayer];
const blueInnovativePlayerId = "3";
const blueInnovativePlayer = PlayerFactory_1.PlayerFactory.blue(blueInnovativePlayerId, PlayerMat_1.PlayerMat.innovative(blueInnovativePlayerId));
const redPatrioticPlayerId = "4";
const redPatrioticPlayer = PlayerFactory_1.PlayerFactory.red(redPatrioticPlayerId, PlayerMat_1.PlayerMat.patriotic(redPatrioticPlayerId));
const yellowEngineeringPlayerId = "5";
const yellowEngineeringPlayer = PlayerFactory_1.PlayerFactory.yellow(yellowEngineeringPlayerId, PlayerMat_1.PlayerMat.engineering(yellowEngineeringPlayerId));
const whiteMechanicalPlayerId = "6";
const whiteMechanicalPlayer = PlayerFactory_1.PlayerFactory.white(whiteMechanicalPlayerId, PlayerMat_1.PlayerMat.mechanical(whiteMechanicalPlayerId));
const purpleMilitantPlayerId = "7";
const purpleMilitantPlayer = PlayerFactory_1.PlayerFactory.purple(purpleMilitantPlayerId, PlayerMat_1.PlayerMat.militant(purpleMilitantPlayerId));
let log;
beforeEach(() => {
    log = new EventLog_1.EventLog();
    game = new Game_1.Game([blackIndustrialPlayer, greenAgriculturalPlayer], log);
});
describe("Produce", () => {
    test("Black produces 1 iron and 1 food for first produce", () => {
        game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
        expect(GameInfo_1.GameInfo.resources(log, blackIndustrialPlayer).oil).toBe(1);
        expect(GameInfo_1.GameInfo.resources(log, blackIndustrialPlayer).metal).toBe(1);
    });
    test("Yellow produces 1 food and 1 worker for first produce and then 1 food and 2 workers for 2nd", () => {
        const spGame = new Game_1.Game([yellowEngineeringPlayer]);
        spGame.produce(yellowEngineeringPlayer, Field_1.Field.f6, Field_1.Field.v9);
        expect(GameInfo_1.GameInfo.resources(spGame.log, yellowEngineeringPlayer).food).toBe(1);
        expect(GameInfo_1.GameInfo.allWorkers(spGame.log, yellowEngineeringPlayer)).toEqual([
            Worker_1.Worker.WORKER_1,
            Worker_1.Worker.WORKER_2,
            Worker_1.Worker.WORKER_3,
        ]);
        spGame.gainCoins(yellowEngineeringPlayer);
        spGame.produce(yellowEngineeringPlayer, Field_1.Field.f6, Field_1.Field.v9);
        expect(GameInfo_1.GameInfo.resources(spGame.log, yellowEngineeringPlayer).food).toBe(2);
        expect(GameInfo_1.GameInfo.allWorkers(spGame.log, yellowEngineeringPlayer)).toEqual([
            Worker_1.Worker.WORKER_1,
            Worker_1.Worker.WORKER_2,
            Worker_1.Worker.WORKER_3,
            Worker_1.Worker.WORKER_4,
            Worker_1.Worker.WORKER_5,
        ]);
    });
    test("Produce with more than 3 workers costs 1 power", () => {
        game.log
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.m6));
        expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(1);
        game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
        expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(0);
    });
    test("Produce with more than 3 workers not possible with 0 power", () => {
        game.log
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.m6))
            .add(new PowerEvent_1.PowerEvent(blackIndustrialPlayerId, -1)); // now 0 power
        expect(() => {
            game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
        }).toThrow(/1 power required, but only 0 power available./);
    });
    test("Produce with more than 5 workers costs 1 power and 1 popularity", () => {
        game.log
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_5, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_6, Field_1.Field.m6));
        expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(1);
        expect(GameInfo_1.GameInfo.popularity(log, blackIndustrialPlayer)).toBe(2);
        game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
        expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(0);
        expect(GameInfo_1.GameInfo.popularity(log, blackIndustrialPlayer)).toBe(1);
    });
    test("Produce with more than 5 workers not possible with 1 power and 0 popularity", () => {
        game.log
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_5, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_6, Field_1.Field.m6))
            .add(new PopularityEvent_1.PopularityEvent(blackIndustrialPlayerId, -2));
        expect(() => {
            game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
        }).toThrow(/1 popularity required, but only 0 popularity available./);
    });
    test("Produce with 8 workers costs 1 power and 1 popularity and 1 coin", () => {
        game.log
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_5, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_6, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_7, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_8, Field_1.Field.m6));
        expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(1);
        expect(GameInfo_1.GameInfo.popularity(log, blackIndustrialPlayer)).toBe(2);
        expect(GameInfo_1.GameInfo.coins(log, blackIndustrialPlayer)).toBe(4);
        game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
        expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(0);
        expect(GameInfo_1.GameInfo.popularity(log, blackIndustrialPlayer)).toBe(1);
        expect(GameInfo_1.GameInfo.coins(log, blackIndustrialPlayer)).toBe(3);
    });
    test("Produce with 8 workers not possible with 1 power and 1 popularity and 0 coins", () => {
        game.log
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_5, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_6, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_7, Field_1.Field.m6))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_8, Field_1.Field.m6))
            .add(new CoinEvent_1.CoinEvent(blackIndustrialPlayerId, -4));
        expect(() => {
            game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
        }).toThrow("1 coin(s) required, but only 0 coin(s) available.");
    });
});
test("Black player has two more power after bolstering power", () => {
    game.bolsterPower(blackIndustrialPlayer);
    expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(3);
});
test("Player has one more combat card after bolstering combat cards", () => {
    expect(GameInfo_1.GameInfo.combatCards(log, blackIndustrialPlayer).length).toBe(4);
    game.bolsterCombatCards(blackIndustrialPlayer);
    expect(GameInfo_1.GameInfo.combatCards(log, blackIndustrialPlayer).length).toBe(5);
});
test("Player pays one coin for bolster", () => {
    expect(GameInfo_1.GameInfo.coins(log, blackIndustrialPlayer)).toBe(4);
    game.bolsterPower(blackIndustrialPlayer);
    expect(GameInfo_1.GameInfo.coins(log, blackIndustrialPlayer)).toBe(3);
});
test("Player cannot bolster without coins", () => {
    game.log.add(new CoinEvent_1.CoinEvent(blackIndustrialPlayer.playerId, -4));
    expect(() => game.bolsterPower(blackIndustrialPlayer)).toThrowError(/1 coin\(s\) required, but only 0 coin\(s\) available./);
});
test("Black character starts on black with two adjacent workers", () => {
    expect(GameInfo_1.GameInfo.unitLocation(log, blackIndustrialPlayer, Character_1.Character.CHARACTER)).toBe(Field_1.Field.black);
    expect(GameInfo_1.GameInfo.unitLocation(log, blackIndustrialPlayer, Worker_1.Worker.WORKER_1)).toBe(Field_1.Field.m6);
    expect(GameInfo_1.GameInfo.unitLocation(log, blackIndustrialPlayer, Worker_1.Worker.WORKER_2)).toBe(Field_1.Field.t8);
});
test("Black character can move from base to encounter on v6 in 2 moves (3 turns)", () => {
    game.move(blackIndustrialPlayer, new Move_1.Move(Character_1.Character.CHARACTER, Field_1.Field.m6));
    expect(GameInfo_1.GameInfo.unitLocation(log, blackIndustrialPlayer, Character_1.Character.CHARACTER)).toBe(Field_1.Field.m6);
    game.produce(greenAgriculturalPlayer, Field_1.Field.m1, Field_1.Field.f1);
    game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
    game.bolsterPower(greenAgriculturalPlayer);
    game.move(blackIndustrialPlayer, new Move_1.Move(Character_1.Character.CHARACTER, Field_1.Field.v6));
    expect(GameInfo_1.GameInfo.unitLocation(log, blackIndustrialPlayer, Character_1.Character.CHARACTER)).toBe(Field_1.Field.v6);
});
test("Player cannot move a mech which has not been deployed", () => {
    const expectedError = /MECH_1 has not been deployed yet./;
    expect(() => game.move(blackIndustrialPlayer, new Move_1.Move(Mech_1.Mech.MECH_1, Field_1.Field.black))).toThrowError(expectedError);
});
test("Black character cannot move to another homebase", () => {
    const expectedError = /CHARACTER is not allowed to move from black:HOMEBASE to green:HOMEBASE./;
    expect(() => game.move(blackIndustrialPlayer, new Move_1.Move(Character_1.Character.CHARACTER, Field_1.Field.green))).toThrowError(expectedError);
});
test("Player can gain one coin", () => {
    expect(GameInfo_1.GameInfo.coins(log, blackIndustrialPlayer)).toBe(4);
    game.gainCoins(blackIndustrialPlayer);
    expect(GameInfo_1.GameInfo.coins(log, blackIndustrialPlayer)).toBe(5);
});
test("Calculate resources", () => {
    game.log
        .add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, [
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.FOOD),
    ]))
        .add(new SpendResourceEvent_1.SpendResourceEvent(blackIndustrialPlayerId, [
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.FOOD),
    ]));
    expect(GameInfo_1.GameInfo.resources(log, blackIndustrialPlayer).food).toBe(2);
});
test("Trade requires coins", () => {
    const expectedError = /1 coin.s. required, but only 0 coin.s. available./;
    game.log.add(new CoinEvent_1.CoinEvent(blackIndustrialPlayerId, -4));
    expect(() => game.tradeResources(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.FOOD, ResourceType_1.ResourceType.FOOD)).toThrowError(expectedError);
});
test("Trade requires a deployed worker", () => {
    const expectedError = /WORKER_3 has not been deployed yet./;
    expect(() => game.tradeResources(blackIndustrialPlayer, Worker_1.Worker.WORKER_3, ResourceType_1.ResourceType.FOOD, ResourceType_1.ResourceType.FOOD)).toThrowError(expectedError);
});
test("Player has two more resources after tradeResources", () => {
    game.tradeResources(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.METAL);
    const res = GameInfo_1.GameInfo.resources(log, blackIndustrialPlayer);
    expect(res.food).toBe(0);
    expect(res.wood).toBe(1);
    expect(res.metal).toBe(1);
    expect(res.oil).toBe(0);
    expect(GameInfo_1.GameInfo.coins(log, blackIndustrialPlayer)).toBe(3);
});
test("Cannot build the same building twice", () => {
    const res = [
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
    ];
    game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, res));
    const expectedError = /Building MILL has already been built./;
    expect(() => {
        game
            .build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MILL, res)
            .bolsterPower(greenAgriculturalPlayer)
            .produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8)
            .gainCoins(greenAgriculturalPlayer)
            .build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MILL, res);
    }).toThrowError(expectedError);
});
test("Cannot build on a location that already has a building", () => {
    const resources1 = [
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
    ];
    const resources2 = [
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
    ];
    game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, resources1));
    game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, resources2));
    expect(() => {
        game
            .build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MILL, resources1)
            .bolsterPower(greenAgriculturalPlayer)
            .bolsterPower(blackIndustrialPlayer)
            .produce(greenAgriculturalPlayer, Field_1.Field.m1, Field_1.Field.f1)
            .build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.ARMORY, resources2);
    }).toThrowError(/m6.MOUNTAIN already has another building./);
});
test("Cannot build without enough wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => game.build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.ARMORY, [])).toThrowError(expectedError);
});
test("Accepts only exact wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => game.build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.ARMORY, [])).toThrowError(expectedError);
});
test("Player can build a mill", () => {
    const res = [
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
    ];
    game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, res));
    game.build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MILL, res);
    expect(GameInfo_1.GameInfo.resources(log, blackIndustrialPlayer).countByType(ResourceType_1.ResourceType.WOOD)).toBe(0);
    expect(GameInfo_1.GameInfo.buildings(log, blackIndustrialPlayer).pop()).toEqual(new Building_1.Building(BuildingType_1.BuildingType.MILL, Field_1.Field.m6));
});
test("Building uses specific resources", () => {
    const resources1 = [
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
    ];
    const resources2 = [new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD), new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD)];
    game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, resources1.concat(resources2)));
    expect(GameInfo_1.GameInfo.availableResources(log, blackIndustrialPlayer)).toEqual(resources1.concat(resources2));
    game.build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MILL, resources1);
    expect(GameInfo_1.GameInfo.availableResources(log, blackIndustrialPlayer)).toEqual(resources2);
});
test("Paying resources requires exact match", () => {
    const resources1 = [
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.black, ResourceType_1.ResourceType.WOOD),
    ];
    const resources2 = [
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.WOOD),
    ];
    game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, resources1));
    const expectedError = "The provided resources (t8:TUNDRA:WOOD, t8:TUNDRA:WOOD, t8:TUNDRA:WOOD) " +
        "are not among your available resources (black:HOMEBASE:WOOD, m6:MOUNTAIN:WOOD, black:HOMEBASE:WOOD).";
    expect(() => game.build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MILL, resources2)).toThrowError(expectedError);
});
test("Can trade for popularity", () => {
    game.tradePopularity(blackIndustrialPlayer);
    expect(GameInfo_1.GameInfo.popularity(log, blackIndustrialPlayer)).toBe(3);
});
test("Black cannot take the same top action twice", () => {
    expect(() => game
        .produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8)
        .produce(greenAgriculturalPlayer, Field_1.Field.m1, Field_1.Field.f1)
        .produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8)).toThrowError("Cannot use actions from the same column.");
});
test("Black cannot take bottom action from the same column as last turn's top action", () => {
    expect(() => game
        .produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8)
        .produce(greenAgriculturalPlayer, Field_1.Field.m1, Field_1.Field.f1)
        .deploy(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_1, [])).toThrowError("Cannot use actions from the same column.");
});
test("Black cannot take top action from the same column as last turn's bottom action", () => {
    const res = [
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
    ];
    game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, res));
    game.deploy(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_1, res);
    game.produce(greenAgriculturalPlayer, Field_1.Field.m1, Field_1.Field.f1);
    expect(() => game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8)).toThrowError("Cannot use actions from the same column.");
});
test("Player with industrial (1) map starts before agricultural (7)", () => {
    expect(() => game.produce(greenAgriculturalPlayer, Field_1.Field.m1, Field_1.Field.f1)).toThrowError("You are not the starting player.");
});
test("Player cannot play out of order", () => {
    expect(() => game.gainCoins(blackIndustrialPlayer).bolsterPower(blackIndustrialPlayer)).toThrowError("It is not your turn yet.");
});
test("Players can take all available top actions at the start of the game", () => {
    expect(Availability_1.availableTopActions(log, blackIndustrialPlayer).length).toBe(4);
});
test("Black player controls three territories at the start", () => {
    expect(GameInfo_1.GameInfo.territories(log, blackIndustrialPlayer)).toEqual([Field_1.Field.black, Field_1.Field.m6, Field_1.Field.t8]);
});
test("Black player controls three units at the start", () => {
    const units = GameInfo_1.GameInfo.units(log, blackIndustrialPlayer);
    expect(units.has(Character_1.Character.CHARACTER)).toBeTruthy();
    expect(units.has(Worker_1.Worker.WORKER_1)).toBeTruthy();
    expect(units.has(Worker_1.Worker.WORKER_2)).toBeTruthy();
});
test("Players don't have available actions when it's not their turn", () => {
    game.bolsterPower(blackIndustrialPlayer);
    expect(Availability_1.availableTopActions(log, blackIndustrialPlayer).length).toBe(0);
});
test("Players have three available actions on their second turn", () => {
    game.bolsterPower(blackIndustrialPlayer).bolsterPower(greenAgriculturalPlayer);
    expect(Availability_1.availableTopActions(log, blackIndustrialPlayer).length).toBe(3);
});
test("Players have no bottom costs available on their first turn", () => {
    expect(Availability_1.availableBottomActions(log, blackIndustrialPlayer).length).toBe(0);
});
test("Players can take all bottom actions if they have enough resources", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    expect(Availability_1.availableBottomActions(log, blackIndustrialPlayer).length).toBe(4);
});
test("Players can only take the bottom actions they can afford", () => {
    addResourcesForPlayer(blackIndustrialPlayer, ResourceType_1.ResourceType.METAL, 4);
    expect(Availability_1.availableBottomActions(log, blackIndustrialPlayer).pop()).toEqual(BottomAction_1.BottomAction.DEPLOY);
});
test("GameInfo restores players from log", () => {
    expect(GameInfo_1.GameInfo.players(log)).toEqual([blackIndustrialPlayer, greenAgriculturalPlayer]);
});
test.skip("Black producing at starting position will get 1 oil and 1 metal", () => {
    game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
    expect(GameInfo_1.GameInfo.availableResources(log, blackIndustrialPlayer)).toEqual([
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.OIL),
    ]);
});
test.skip("Producing with 8 workers costs 1 popularity, 1 coins, 1 power", () => {
    game.log
        .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.t8))
        .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.t8))
        .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_5, Field_1.Field.t8))
        .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_6, Field_1.Field.t8))
        .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_7, Field_1.Field.t8))
        .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_8, Field_1.Field.t8));
    game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
    expect(GameInfo_1.GameInfo.availableResources(log, blackIndustrialPlayer)).toEqual([
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.OIL),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.OIL),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.OIL),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.OIL),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.OIL),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.OIL),
        new Resource_1.Resource(Field_1.Field.t8, ResourceType_1.ResourceType.OIL),
    ]);
    expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(0);
    expect(GameInfo_1.GameInfo.popularity(log, blackIndustrialPlayer)).toBe(1);
    expect(GameInfo_1.GameInfo.coins(log, blackIndustrialPlayer)).toBe(3);
});
test("Player only has resources on controlled territories", () => {
    game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, [
        new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.white, ResourceType_1.ResourceType.METAL),
    ]));
    expect(GameInfo_1.GameInfo.resources(log, blackIndustrialPlayer).metal).toEqual(1);
});
test("Calculate player score", () => {
    const score = GameInfo_1.GameInfo.score(log, [blackIndustrialPlayer, greenAgriculturalPlayer]);
    expect(score.get(blackIndustrialPlayer)).toBe(8);
    expect(score.get(greenAgriculturalPlayer)).toBe(11);
});
test("Calculate player score with max popularity", () => {
    game.log
        .add(new StarEvent_1.StarEvent(blackIndustrialPlayerId, Star_1.Star.FIRST_COMBAT_WIN))
        .add(new StarEvent_1.StarEvent(blackIndustrialPlayerId, Star_1.Star.SECOND_COMBAT_WIN))
        .add(new PopularityEvent_1.PopularityEvent(blackIndustrialPlayerId, 16));
    addResourcesForPlayer(blackIndustrialPlayer, ResourceType_1.ResourceType.METAL, 11);
    expect(GameInfo_1.GameInfo.score(log, testPlayers).get(blackIndustrialPlayer)).toBe(37);
});
test("Player automatically passes when no other option is available", () => {
    game.bolsterPower(blackIndustrialPlayer);
    expect(game.log.log.pop()).toBeInstanceOf(PassEvent_1.PassEvent);
});
test("Player does not pass automatically when bottom action is available", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    game.bolsterPower(blackIndustrialPlayer);
    expect(game.log.log.pop()).not.toBeInstanceOf(PassEvent_1.PassEvent);
});
test("Player does automatically pass after bottom action", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    game.build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.ARMORY, exports.resources(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD, 4));
    expect(game.log.log.pop()).toBeInstanceOf(PassEvent_1.PassEvent);
});
test("Game ends when a player get her 6th star", () => {
    game.log
        .add(new StarEvent_1.StarEvent(blackIndustrialPlayerId, Star_1.Star.FIRST_COMBAT_WIN))
        .add(new StarEvent_1.StarEvent(blackIndustrialPlayerId, Star_1.Star.SECOND_COMBAT_WIN))
        .add(new StarEvent_1.StarEvent(blackIndustrialPlayerId, Star_1.Star.FIRST_OBJECTIVE))
        .add(new StarEvent_1.StarEvent(blackIndustrialPlayerId, Star_1.Star.ALL_WORKERS))
        .add(new StarEvent_1.StarEvent(blackIndustrialPlayerId, Star_1.Star.ALL_MECHS))
        .add(new EnlistEvent_1.EnlistEvent(blackIndustrialPlayerId, RecruitReward_1.RecruitReward.COINS, BottomAction_1.BottomAction.ENLIST))
        .add(new EnlistEvent_1.EnlistEvent(blackIndustrialPlayerId, RecruitReward_1.RecruitReward.COMBAT_CARDS, BottomAction_1.BottomAction.DEPLOY))
        .add(new EnlistEvent_1.EnlistEvent(blackIndustrialPlayerId, RecruitReward_1.RecruitReward.POPULARITY, BottomAction_1.BottomAction.UPGRADE))
        .add(new EnlistEvent_1.EnlistEvent(blackIndustrialPlayerId, RecruitReward_1.RecruitReward.POWER, BottomAction_1.BottomAction.BUILD));
    game.gainCoins(blackIndustrialPlayer);
    expect(GameInfo_1.GameInfo.gameOver(log)).toBeTruthy();
});
describe("Stars", () => {
    test("Players get a star for having maximum power", () => {
        game.log.add(new PowerEvent_1.PowerEvent(blackIndustrialPlayerId, 13));
        game.bolsterPower(blackIndustrialPlayer);
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star_1.Star.MAX_POWER);
    });
    test("Players get a star for having maximum popularity", () => {
        game.log.add(new PopularityEvent_1.PopularityEvent(blackIndustrialPlayerId, 15));
        game.tradePopularity(blackIndustrialPlayer);
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star_1.Star.MAX_POPULARITY);
    });
    test("Players get a star for deploying all workers", () => {
        game.log
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.black))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.black))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_5, Field_1.Field.black))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_6, Field_1.Field.black))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_7, Field_1.Field.black))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_8, Field_1.Field.black));
        game.tradePopularity(blackIndustrialPlayer);
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star_1.Star.ALL_WORKERS);
    });
    test("Players get a star for deploying all mechs", () => {
        mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
        game.log
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Mech_1.Mech.MECH_1, Field_1.Field.black))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Mech_1.Mech.MECH_2, Field_1.Field.black))
            .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Mech_1.Mech.MECH_3, Field_1.Field.black));
        game.gainCoins(blackIndustrialPlayer);
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toEqual([]);
        game.log.add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Mech_1.Mech.MECH_4, Field_1.Field.black));
        game.build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MINE, exports.resources(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD, 4));
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star_1.Star.ALL_MECHS);
    });
    test("Players get a star for enlisting all recruiters", () => {
        game.log
            .add(new EnlistEvent_1.EnlistEvent(blackIndustrialPlayerId, RecruitReward_1.RecruitReward.COINS, BottomAction_1.BottomAction.ENLIST))
            .add(new EnlistEvent_1.EnlistEvent(blackIndustrialPlayerId, RecruitReward_1.RecruitReward.COMBAT_CARDS, BottomAction_1.BottomAction.DEPLOY))
            .add(new EnlistEvent_1.EnlistEvent(blackIndustrialPlayerId, RecruitReward_1.RecruitReward.POPULARITY, BottomAction_1.BottomAction.UPGRADE))
            .add(new EnlistEvent_1.EnlistEvent(blackIndustrialPlayerId, RecruitReward_1.RecruitReward.POWER, BottomAction_1.BottomAction.BUILD));
        game.gainCoins(blackIndustrialPlayer);
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star_1.Star.ALL_RECRUITS);
    });
    test("Players get a star for building all buildings", () => {
        game.log
            .add(new BuildEvent_1.BuildEvent(blackIndustrialPlayerId, workerLocation(blackIndustrialPlayer), BuildingType_1.BuildingType.ARMORY))
            .add(new BuildEvent_1.BuildEvent(blackIndustrialPlayerId, workerLocation(blackIndustrialPlayer), BuildingType_1.BuildingType.MILL))
            .add(new BuildEvent_1.BuildEvent(blackIndustrialPlayerId, workerLocation(blackIndustrialPlayer), BuildingType_1.BuildingType.MINE))
            .add(new BuildEvent_1.BuildEvent(blackIndustrialPlayerId, workerLocation(blackIndustrialPlayer), BuildingType_1.BuildingType.MONUMENT));
        game.gainCoins(blackIndustrialPlayer);
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star_1.Star.ALL_BUILDINGS);
    });
    test("Players get a star for unlocking all upgrades", () => {
        game.log
            .add(new UpgradeEvent_1.UpgradeEvent(blackIndustrialPlayerId, TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.ENLIST))
            .add(new UpgradeEvent_1.UpgradeEvent(blackIndustrialPlayerId, TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.ENLIST))
            .add(new UpgradeEvent_1.UpgradeEvent(blackIndustrialPlayerId, TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.ENLIST))
            .add(new UpgradeEvent_1.UpgradeEvent(blackIndustrialPlayerId, TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.ENLIST))
            .add(new UpgradeEvent_1.UpgradeEvent(blackIndustrialPlayerId, TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.ENLIST))
            .add(new UpgradeEvent_1.UpgradeEvent(blackIndustrialPlayerId, TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.ENLIST));
        game.gainCoins(blackIndustrialPlayer);
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star_1.Star.ALL_UPGRADES);
    });
    test.skip("Players get stars for the first two combat wins", () => {
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toEqual([Star_1.Star.FIRST_COMBAT_WIN, Star_1.Star.SECOND_COMBAT_WIN]);
    });
    test.skip("Players get a star for completing an objective", () => {
        expect(GameInfo_1.GameInfo.stars(log, blackIndustrialPlayer)).toEqual([Star_1.Star.FIRST_COMBAT_WIN, Star_1.Star.SECOND_COMBAT_WIN]);
    });
});
describe("Play order", () => {
    test("In a one player game there are no neighbors", () => {
        expect(GameInfo_1.GameInfo.neighbors([blackIndustrialPlayer], blackIndustrialPlayer)).toEqual([]);
    });
    test("In a two player game there are is only one neighbor", () => {
        expect(GameInfo_1.GameInfo.neighbors(testPlayers, blackIndustrialPlayer)).toEqual([greenAgriculturalPlayer]);
    });
    test("In a three player game all other players are neighbors", () => {
        const threePlayers = [blackIndustrialPlayer, greenAgriculturalPlayer, blueInnovativePlayer];
        expect(GameInfo_1.GameInfo.neighbors(threePlayers, blueInnovativePlayer)).toEqual([
            blackIndustrialPlayer,
            greenAgriculturalPlayer,
        ]);
    });
    test("In a seven player game there are only two neighbors", () => {
        const sevenPlayers = [
            blackIndustrialPlayer,
            greenAgriculturalPlayer,
            blueInnovativePlayer,
            purpleMilitantPlayer,
            yellowEngineeringPlayer,
            redPatrioticPlayer,
            whiteMechanicalPlayer,
        ];
        expect(GameInfo_1.GameInfo.neighbors(sevenPlayers, purpleMilitantPlayer)).toEqual([
            redPatrioticPlayer,
            yellowEngineeringPlayer,
        ]);
        expect(GameInfo_1.GameInfo.neighbors(sevenPlayers, greenAgriculturalPlayer)).toEqual([
            blueInnovativePlayer,
            whiteMechanicalPlayer,
        ]);
        expect(GameInfo_1.GameInfo.neighbors(sevenPlayers, whiteMechanicalPlayer)).toEqual([
            greenAgriculturalPlayer,
            blackIndustrialPlayer,
        ]);
    });
});
test("Cannot deploy the same mech twice", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    expect(() => game
        .deploy(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_1, exports.resources(Field_1.Field.m6, ResourceType_1.ResourceType.METAL, 4))
        .bolsterPower(greenAgriculturalPlayer)
        .bolsterPower(blackIndustrialPlayer)
        .tradePopularity(greenAgriculturalPlayer)
        .deploy(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_1, exports.resources(Field_1.Field.m6, ResourceType_1.ResourceType.METAL, 4))).toThrowError("MECH_1 has already been deployed.");
});
test.skip("Upgrade makes a top action more powerful and a bottom action cheaper", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    game.upgrade(blackIndustrialPlayer, TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.BUILD, exports.resources(Field_1.Field.t8, ResourceType_1.ResourceType.METAL, 4));
});
test("Player cannot gain more than 16 power", () => {
    game.log.add(new PowerEvent_1.PowerEvent(blackIndustrialPlayerId, 15)); // total now 16
    game.bolsterPower(blackIndustrialPlayer);
    expect(GameInfo_1.GameInfo.power(log, blackIndustrialPlayer)).toBe(16);
});
test("Player cannot gain more than 18 popularity", () => {
    game.log.add(new PopularityEvent_1.PopularityEvent(blackIndustrialPlayerId, 16)); // total now 18
    game.tradePopularity(blackIndustrialPlayer);
    expect(GameInfo_1.GameInfo.popularity(log, blackIndustrialPlayer)).toBe(18);
});
test("Cannot start a game without players", () => {
    expect(() => new Game_1.Game([])).toThrowError(/The game requires 1-7 players./);
});
test("Cannot start a game with more than 8 players", () => {
    const id = "1";
    const players = _.map(() => PlayerFactory_1.PlayerFactory.white(id, PlayerMat_1.PlayerMat.agricultural(id)), _.range(0, 8));
    expect(() => new Game_1.Game(players)).toThrowError(/The game requires 1-7 players./);
});
test("Cannot start a game where two players choose the same faction", () => {
    const onePlayer = PlayerFactory_1.PlayerFactory.green(blackIndustrialPlayerId, PlayerMat_1.PlayerMat.agricultural(blackIndustrialPlayerId));
    const otherPlayer = PlayerFactory_1.PlayerFactory.green(greenAgriculturalPlayerId, PlayerMat_1.PlayerMat.industrial(greenAgriculturalPlayerId));
    expect(() => new Game_1.Game([onePlayer, otherPlayer])).toThrowError(/Each faction and player mat is only allowed once./);
});
test("Cannot start a game where two players choose the same faction", () => {
    const onePlayer = PlayerFactory_1.PlayerFactory.green(blackIndustrialPlayerId, PlayerMat_1.PlayerMat.agricultural(blackIndustrialPlayerId));
    const otherPlayer = PlayerFactory_1.PlayerFactory.black(greenAgriculturalPlayerId, PlayerMat_1.PlayerMat.agricultural(blackIndustrialPlayerId));
    expect(() => new Game_1.Game([onePlayer, otherPlayer])).toThrowError(/Each faction and player mat is only allowed once./);
});
test("Cannot start a game where some players have identical ids", () => {
    const otherPlayer = PlayerFactory_1.PlayerFactory.green(blackIndustrialPlayerId, PlayerMat_1.PlayerMat.agricultural(blackIndustrialPlayerId));
    expect(() => new Game_1.Game([blackIndustrialPlayer, otherPlayer])).toThrowError(/Some players have identical PlayerIds./);
});
test.skip("Buildings cannot be placed on home territories", fail);
test.skip("Mechs cannot be placed on home territories", fail);
test.skip("Buildings cannot be placed on lakes", fail);
test.skip("Cannot move the same unit multiple times", fail);
exports.resources = (location, resourceType, count = 10) => {
    const res = [];
    for (let i = 0; i < count; ++i) {
        res.push(new Resource_1.Resource(location, resourceType));
    }
    return res;
};
const workerLocation = (player) => GameInfo_1.GameInfo.unitLocation(log, player, Worker_1.Worker.WORKER_1);
const addResourcesForPlayer = (player, resourceType, count) => {
    game.log.add(new GainResourceEvent_1.GainResourceEvent(player.playerId, exports.resources(workerLocation(player), resourceType, count)));
};
const mockResourcesAndCoinsForPlayer = (player) => {
    const location = workerLocation(player);
    game.log
        .add(new GainResourceEvent_1.GainResourceEvent(player.playerId, exports.resources(location, ResourceType_1.ResourceType.METAL)))
        .add(new GainResourceEvent_1.GainResourceEvent(player.playerId, exports.resources(location, ResourceType_1.ResourceType.WOOD)))
        .add(new GainResourceEvent_1.GainResourceEvent(player.playerId, exports.resources(location, ResourceType_1.ResourceType.OIL)))
        .add(new GainResourceEvent_1.GainResourceEvent(player.playerId, exports.resources(location, ResourceType_1.ResourceType.FOOD)))
        .add(new CoinEvent_1.CoinEvent(player.playerId, 10));
};

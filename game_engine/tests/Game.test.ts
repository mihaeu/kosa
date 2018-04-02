import { availableBottomActions, availableTopActions } from "../src/Availability";
import { BottomAction } from "../src/BottomAction";
import { Building } from "../src/Building";
import { BuildingType } from "../src/BuildingType";
import { BuildEvent } from "../src/Events/BuildEvent";
import { CoinEvent } from "../src/Events/CoinEvent";
import { DeployEvent } from "../src/Events/DeployEvent";
import { EnlistEvent } from "../src/Events/EnlistEvent";
import { EventLog } from "../src/Events/EventLog";
import { GainResourceEvent } from "../src/Events/GainResourceEvent";
import { PassEvent } from "../src/Events/PassEvent";
import { PopularityEvent } from "../src/Events/PopularityEvent";
import { PowerEvent } from "../src/Events/PowerEvent";
import { SpendResourceEvent } from "../src/Events/SpendResourceEvent";
import { StarEvent } from "../src/Events/StarEvent";
import { UpgradeEvent } from "../src/Events/UpgradeEvent";
import { Field } from "../src/Field";
import { Game } from "../src/Game";
import { GameInfo } from "../src/GameInfo";
import { Player } from "../src/Player";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";
import { RecruitReward } from "../src/RecruitReward";
import { Resource } from "../src/Resource";
import { ResourceType } from "../src/ResourceType";
import { Star } from "../src/Star";
import { TopAction } from "../src/TopAction";
import { Character } from "../src/Units/Character";
import { Mech } from "../src/Units/Mech";
import { Worker } from "../src/Units/Worker";

let game: Game;

const blackIndustrialPlayerId = new PlayerId(1);
const greenAgriculturalPlayerId = new PlayerId(2);

const blackIndustrialPlayer = PlayerFactory.black(
    blackIndustrialPlayerId,
    PlayerMat.industrial(blackIndustrialPlayerId),
);

const greenAgriculturalPlayer = PlayerFactory.green(
    greenAgriculturalPlayerId,
    PlayerMat.agricultural(greenAgriculturalPlayerId),
);
const testPlayers = [blackIndustrialPlayer, greenAgriculturalPlayer];

const blueInnovativePlayerId = new PlayerId(3);
const blueInnovativePlayer = PlayerFactory.blue(blueInnovativePlayerId, PlayerMat.innovative(blueInnovativePlayerId));

const redPatrioticPlayerId = new PlayerId(4);
const redPatrioticPlayer = PlayerFactory.red(redPatrioticPlayerId, PlayerMat.patriotic(redPatrioticPlayerId));

const yellowEngineeringPlayerId = new PlayerId(5);
const yellowEngineeringPlayer = PlayerFactory.yellow(
    yellowEngineeringPlayerId,
    PlayerMat.engineering(yellowEngineeringPlayerId),
);

const whiteMechanicalPlayerId = new PlayerId(6);
const whiteMechanicalPlayer = PlayerFactory.white(
    whiteMechanicalPlayerId,
    PlayerMat.mechanical(whiteMechanicalPlayerId),
);

const purpleMilitantPlayerId = new PlayerId(7);
const purpleMilitantPlayer = PlayerFactory.purple(purpleMilitantPlayerId, PlayerMat.militant(purpleMilitantPlayerId));

let log: EventLog;

beforeEach(() => {
    log = new EventLog();
    game = new Game([blackIndustrialPlayer, greenAgriculturalPlayer], log);
});

describe("Produce", () => {
    test("Black produces 1 iron and 1 food for first produce", () => {
        game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
        expect(GameInfo.resources(log, blackIndustrialPlayer).oil).toBe(1);
        expect(GameInfo.resources(log, blackIndustrialPlayer).metal).toBe(1);
    });

    test("Yellow produces 1 food and 1 worker for first produce and then 1 food and 2 workers for 2nd", () => {
        const spGame = new Game([yellowEngineeringPlayer]);
        spGame.produce(yellowEngineeringPlayer, Field.f6, Field.v9);
        expect(GameInfo.resources(spGame.log, yellowEngineeringPlayer).food).toBe(1);
        expect(GameInfo.allWorkers(spGame.log, yellowEngineeringPlayer)).toEqual([
            Worker.WORKER_1,
            Worker.WORKER_2,
            Worker.WORKER_3,
        ]);
        spGame.gainCoins(yellowEngineeringPlayer);
        spGame.produce(yellowEngineeringPlayer, Field.f6, Field.v9);
        expect(GameInfo.resources(spGame.log, yellowEngineeringPlayer).food).toBe(2);
        expect(GameInfo.allWorkers(spGame.log, yellowEngineeringPlayer)).toEqual([
            Worker.WORKER_1,
            Worker.WORKER_2,
            Worker.WORKER_3,
            Worker.WORKER_4,
            Worker.WORKER_5,
        ]);
    });

    test("Produce with more than 3 workers costs 1 power", () => {
        game.log
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.m6));
        expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(1);
        game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
        expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(0);
    });

    test("Produce with more than 3 workers not possible with 0 power", () => {
        game.log
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.m6))
            .add(new PowerEvent(blackIndustrialPlayerId, -1)); // now 0 power
        expect(() => {
            game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
        }).toThrow(/1 power required, but only 0 power available./);
    });

    test("Produce with more than 5 workers costs 1 power and 1 popularity", () => {
        game.log
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_5, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_6, Field.m6));
        expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(1);
        expect(GameInfo.popularity(log, blackIndustrialPlayer)).toBe(2);
        game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
        expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(0);
        expect(GameInfo.popularity(log, blackIndustrialPlayer)).toBe(1);
    });

    test("Produce with more than 5 workers not possible with 1 power and 0 popularity", () => {
        game.log
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_5, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_6, Field.m6))
            .add(new PopularityEvent(blackIndustrialPlayerId, -2));
        expect(() => {
            game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
        }).toThrow(/1 popularity required, but only 0 popularity available./);
    });

    test("Produce with 8 workers costs 1 power and 1 popularity and 1 coin", () => {
        game.log
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_5, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_6, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_7, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_8, Field.m6));
        expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(1);
        expect(GameInfo.popularity(log, blackIndustrialPlayer)).toBe(2);
        expect(GameInfo.coins(log, blackIndustrialPlayer)).toBe(4);
        game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
        expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(0);
        expect(GameInfo.popularity(log, blackIndustrialPlayer)).toBe(1);
        expect(GameInfo.coins(log, blackIndustrialPlayer)).toBe(3);
    });

    test("Produce with 8 workers not possible with 1 power and 1 popularity and 0 coins", () => {
        game.log
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_5, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_6, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_7, Field.m6))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_8, Field.m6))
            .add(new CoinEvent(blackIndustrialPlayerId, -4));
        expect(() => {
            game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
        }).toThrow("1 coin(s) required, but only 0 coin(s) available.");
    });
});

test("Black player has two more power after bolstering power", () => {
    game.bolsterPower(blackIndustrialPlayer);
    expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(3);
});

test("Player has one more combat card after bolstering combat cards", () => {
    expect(GameInfo.combatCards(log, blackIndustrialPlayer).length).toBe(4);
    game.bolsterCombatCards(blackIndustrialPlayer);
    expect(GameInfo.combatCards(log, blackIndustrialPlayer).length).toBe(5);
});

test("Player pays one coin for bolster", () => {
    expect(GameInfo.coins(log, blackIndustrialPlayer)).toBe(4);
    game.bolsterPower(blackIndustrialPlayer);
    expect(GameInfo.coins(log, blackIndustrialPlayer)).toBe(3);
});

test("Player cannot bolster without coins", () => {
    game.log.add(new CoinEvent(blackIndustrialPlayer.playerId, -4));
    expect(() => game.bolsterPower(blackIndustrialPlayer)).toThrowError(
        /1 coin\(s\) required, but only 0 coin\(s\) available./,
    );
});

test("Black character starts on black with two adjacent workers", () => {
    expect(GameInfo.unitLocation(log, blackIndustrialPlayer, Character.CHARACTER)).toBe(Field.black);
    expect(GameInfo.unitLocation(log, blackIndustrialPlayer, Worker.WORKER_1)).toBe(Field.m6);
    expect(GameInfo.unitLocation(log, blackIndustrialPlayer, Worker.WORKER_2)).toBe(Field.t8);
});

test("Black character can move from base to encounter on v6 in 2 moves (3 turns)", () => {
    game.move(blackIndustrialPlayer, Character.CHARACTER, Field.m6);
    expect(GameInfo.unitLocation(log, blackIndustrialPlayer, Character.CHARACTER)).toBe(Field.m6);
    game.produce(greenAgriculturalPlayer, Field.m1, Field.f1);

    game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
    game.bolsterPower(greenAgriculturalPlayer);

    game.move(blackIndustrialPlayer, Character.CHARACTER, Field.v6);
    expect(GameInfo.unitLocation(log, blackIndustrialPlayer, Character.CHARACTER)).toBe(Field.v6);
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
    expect(GameInfo.coins(log, blackIndustrialPlayer)).toBe(4);
    game.gainCoins(blackIndustrialPlayer);
    expect(GameInfo.coins(log, blackIndustrialPlayer)).toBe(5);
});

test("Calculate resources", () => {
    game.log
        .add(
            new GainResourceEvent(blackIndustrialPlayerId, [
                new Resource(Field.black, ResourceType.FOOD),
                new Resource(Field.black, ResourceType.FOOD),
                new Resource(Field.black, ResourceType.FOOD),
                new Resource(Field.black, ResourceType.FOOD),
                new Resource(Field.black, ResourceType.FOOD),
            ]),
        )
        .add(
            new SpendResourceEvent(blackIndustrialPlayerId, [
                new Resource(Field.black, ResourceType.FOOD),
                new Resource(Field.black, ResourceType.FOOD),
                new Resource(Field.black, ResourceType.FOOD),
            ]),
        );
    expect(GameInfo.resources(log, blackIndustrialPlayer).food).toBe(2);
});

test("Trade requires coins", () => {
    const expectedError = /1 coin.s. required, but only 0 coin.s. available./;
    game.log.add(new CoinEvent(blackIndustrialPlayerId, -4));
    expect(() =>
        game.tradeResources(blackIndustrialPlayer, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD),
    ).toThrowError(expectedError);
});

test("Trade requires a deployed worker", () => {
    const expectedError = /WORKER_3 has not been deployed yet./;
    expect(() =>
        game.tradeResources(blackIndustrialPlayer, Worker.WORKER_3, ResourceType.FOOD, ResourceType.FOOD),
    ).toThrowError(expectedError);
});

test("Player has two more resources after tradeResources", () => {
    game.tradeResources(blackIndustrialPlayer, Worker.WORKER_1, ResourceType.WOOD, ResourceType.METAL);
    const res = GameInfo.resources(log, blackIndustrialPlayer);
    expect(res.food).toBe(0);
    expect(res.wood).toBe(1);
    expect(res.metal).toBe(1);
    expect(res.oil).toBe(0);
    expect(GameInfo.coins(log, blackIndustrialPlayer)).toBe(3);
});

test("Cannot build the same building twice", () => {
    const res = [
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
    ];
    game.log.add(new GainResourceEvent(blackIndustrialPlayerId, res));

    const expectedError = /Building MILL has already been built./;
    expect(() => {
        game
            .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, res)
            .bolsterPower(greenAgriculturalPlayer)
            .produce(blackIndustrialPlayer, Field.m6, Field.t8)
            .gainCoins(greenAgriculturalPlayer)
            .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, res);
    }).toThrowError(expectedError);
});

test("Cannot build on a location that already has a building", () => {
    const resources1 = [
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
    ];
    const resources2 = [
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
    ];
    game.log.add(new GainResourceEvent(blackIndustrialPlayerId, resources1));
    game.log.add(new GainResourceEvent(blackIndustrialPlayerId, resources2));

    expect(() => {
        game
            .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources1)
            .bolsterPower(greenAgriculturalPlayer)
            .bolsterPower(blackIndustrialPlayer)
            .produce(greenAgriculturalPlayer, Field.m1, Field.f1)
            .build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.ARMORY, resources2);
    }).toThrowError(/m6.MOUNTAIN already has another building./);
});

test("Cannot build without enough wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => game.build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.ARMORY, [])).toThrowError(
        expectedError,
    );
});

test("Accepts only exact wood", () => {
    const expectedError = /Not enough resources of type WOOD; 3 required, but only 0 available./;
    expect(() => game.build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.ARMORY, [])).toThrowError(
        expectedError,
    );
});

test("Player can build a mill", () => {
    const res = [
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
    ];
    game.log.add(new GainResourceEvent(blackIndustrialPlayerId, res));
    game.build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, res);

    expect(GameInfo.resources(log, blackIndustrialPlayer).countByType(ResourceType.WOOD)).toBe(0);
    expect(GameInfo.buildings(log, blackIndustrialPlayer).pop()).toEqual(new Building(BuildingType.MILL, Field.m6));
});

test("Building uses specific resources", () => {
    const resources1 = [
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.m6, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
    ];
    const resources2 = [new Resource(Field.m6, ResourceType.WOOD), new Resource(Field.black, ResourceType.WOOD)];
    game.log.add(new GainResourceEvent(blackIndustrialPlayerId, resources1.concat(resources2)));
    expect(GameInfo.availableResources(log, blackIndustrialPlayer)).toEqual(resources1.concat(resources2));

    game.build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources1);
    expect(GameInfo.availableResources(log, blackIndustrialPlayer)).toEqual(resources2);
});

test("Paying resources requires exact match", () => {
    const resources1 = [
        new Resource(Field.black, ResourceType.WOOD),
        new Resource(Field.m6, ResourceType.WOOD),
        new Resource(Field.black, ResourceType.WOOD),
    ];
    const resources2 = [
        new Resource(Field.t8, ResourceType.WOOD),
        new Resource(Field.t8, ResourceType.WOOD),
        new Resource(Field.t8, ResourceType.WOOD),
    ];

    game.log.add(new GainResourceEvent(blackIndustrialPlayerId, resources1));

    const expectedError =
        "The provided resources (t8:TUNDRA:WOOD, t8:TUNDRA:WOOD, t8:TUNDRA:WOOD) " +
        "are not among your available resources (black:HOMEBASE:WOOD, m6:MOUNTAIN:WOOD, black:HOMEBASE:WOOD).";
    expect(() => game.build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.MILL, resources2)).toThrowError(
        expectedError,
    );
});

test("Can trade for popularity", () => {
    game.tradePopularity(blackIndustrialPlayer);
    expect(GameInfo.popularity(log, blackIndustrialPlayer)).toBe(3);
});

test("Black cannot take the same top action twice", () => {
    expect(() =>
        game
            .produce(blackIndustrialPlayer, Field.m6, Field.t8)
            .produce(greenAgriculturalPlayer, Field.m1, Field.f1)
            .produce(blackIndustrialPlayer, Field.m6, Field.t8),
    ).toThrowError("Cannot use actions from the same column.");
});

test("Black cannot take bottom action from the same column as last turn's top action", () => {
    expect(() =>
        game
            .produce(blackIndustrialPlayer, Field.m6, Field.t8)
            .produce(greenAgriculturalPlayer, Field.m1, Field.f1)
            .deploy(blackIndustrialPlayer, Worker.WORKER_1, Mech.MECH_1, []),
    ).toThrowError("Cannot use actions from the same column.");
});

test("Black cannot take top action from the same column as last turn's bottom action", () => {
    const res = [
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.m6, ResourceType.METAL),
    ];
    game.log.add(new GainResourceEvent(blackIndustrialPlayerId, res));

    game.deploy(blackIndustrialPlayer, Worker.WORKER_1, Mech.MECH_1, res);
    game.produce(greenAgriculturalPlayer, Field.m1, Field.f1);
    expect(() => game.produce(blackIndustrialPlayer, Field.m6, Field.t8)).toThrowError(
        "Cannot use actions from the same column.",
    );
});

test("Player with industrial (1) map starts before agricultural (7)", () => {
    expect(() => game.produce(greenAgriculturalPlayer, Field.m1, Field.f1)).toThrowError(
        "You are not the starting player.",
    );
});

test("Player cannot play out of order", () => {
    expect(() => game.gainCoins(blackIndustrialPlayer).bolsterPower(blackIndustrialPlayer)).toThrowError(
        "It is not your turn yet.",
    );
});

test("Players can take all available top actions at the start of the game", () => {
    expect(availableTopActions(log, testPlayers, blackIndustrialPlayer).length).toBe(4);
});

test("Black player controls three territories at the start", () => {
    expect(GameInfo.territories(log, blackIndustrialPlayer)).toEqual([Field.black, Field.m6, Field.t8]);
});

test("Black player controls three units at the start", () => {
    const units = GameInfo.units(log, blackIndustrialPlayer);
    expect(units.has(Character.CHARACTER)).toBeTruthy();
    expect(units.has(Worker.WORKER_1)).toBeTruthy();
    expect(units.has(Worker.WORKER_2)).toBeTruthy();
});

test("Players don't have available actions when it's not their turn", () => {
    game.bolsterPower(blackIndustrialPlayer);
    expect(availableTopActions(log, testPlayers, blackIndustrialPlayer).length).toBe(0);
});

test("Players have three available actions on their second turn", () => {
    game.bolsterPower(blackIndustrialPlayer).bolsterPower(greenAgriculturalPlayer);
    expect(availableTopActions(log, testPlayers, blackIndustrialPlayer).length).toBe(3);
});

test("Players have no bottom costs available on their first turn", () => {
    expect(availableBottomActions(log, testPlayers, blackIndustrialPlayer).length).toBe(0);
});

test("Players can take all bottom actions if they have enough resources", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    expect(availableBottomActions(log, testPlayers, blackIndustrialPlayer).length).toBe(4);
});

test("Players can only take the bottom actions they can afford", () => {
    addResourcesForPlayer(blackIndustrialPlayer, ResourceType.METAL, 4);
    expect(availableBottomActions(log, testPlayers, blackIndustrialPlayer).pop()).toEqual(BottomAction.DEPLOY);
});

test.skip("Black producing at starting position will get 1 oil and 1 metal", () => {
    game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
    expect(GameInfo.availableResources(log, blackIndustrialPlayer)).toEqual([
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.t8, ResourceType.OIL),
    ]);
});

test.skip("Producing with 8 workers costs 1 popularity, 1 coins, 1 power", () => {
    game.log
        .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.t8))
        .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.t8))
        .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_5, Field.t8))
        .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_6, Field.t8))
        .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_7, Field.t8))
        .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_8, Field.t8));

    game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
    expect(GameInfo.availableResources(log, blackIndustrialPlayer)).toEqual([
        new Resource(Field.m6, ResourceType.METAL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
        new Resource(Field.t8, ResourceType.OIL),
    ]);
    expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(0);
    expect(GameInfo.popularity(log, blackIndustrialPlayer)).toBe(1);
    expect(GameInfo.coins(log, blackIndustrialPlayer)).toBe(3);
});

test("Player only has resources on controlled territories", () => {
    game.log.add(
        new GainResourceEvent(blackIndustrialPlayerId, [
            new Resource(Field.m6, ResourceType.METAL),
            new Resource(Field.white, ResourceType.METAL),
        ]),
    );
    expect(GameInfo.resources(log, blackIndustrialPlayer).metal).toEqual(1);
});

test("Calculate player score", () => {
    const score = GameInfo.score(log, [blackIndustrialPlayer, greenAgriculturalPlayer]);
    expect(score.get(blackIndustrialPlayer)).toBe(8);
    expect(score.get(greenAgriculturalPlayer)).toBe(11);
});

test("Calculate player score with max popularity", () => {
    game.log
        .add(new StarEvent(blackIndustrialPlayerId, Star.FIRST_COMBAT_WIN))
        .add(new StarEvent(blackIndustrialPlayerId, Star.SECOND_COMBAT_WIN))
        .add(new PopularityEvent(blackIndustrialPlayerId, 16));
    addResourcesForPlayer(blackIndustrialPlayer, ResourceType.METAL, 11);
    expect(GameInfo.score(log, testPlayers).get(blackIndustrialPlayer)).toBe(37);
});

test("Player automatically passes when no other option is available", () => {
    game.bolsterPower(blackIndustrialPlayer);
    expect(game.log.log.pop()).toBeInstanceOf(PassEvent);
});

test("Player does not pass automatically when bottom action is available", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    game.bolsterPower(blackIndustrialPlayer);
    expect(game.log.log.pop()).not.toBeInstanceOf(PassEvent);
});

test("Player does automatically pass after bottom action", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    game.build(blackIndustrialPlayer, Worker.WORKER_1, BuildingType.ARMORY, resources(Field.m6, ResourceType.WOOD, 4));
    expect(game.log.log.pop()).toBeInstanceOf(PassEvent);
});

test("Game ends when a player get her 6th star", () => {
    game.log
        .add(new StarEvent(blackIndustrialPlayerId, Star.FIRST_COMBAT_WIN))
        .add(new StarEvent(blackIndustrialPlayerId, Star.SECOND_COMBAT_WIN))
        .add(new StarEvent(blackIndustrialPlayerId, Star.FIRST_OBJECTIVE))
        .add(new StarEvent(blackIndustrialPlayerId, Star.ALL_WORKERS))
        .add(new StarEvent(blackIndustrialPlayerId, Star.ALL_MECHS))
        .add(new EnlistEvent(blackIndustrialPlayerId, RecruitReward.COINS, BottomAction.ENLIST))
        .add(new EnlistEvent(blackIndustrialPlayerId, RecruitReward.COMBAT_CARDS, BottomAction.DEPLOY))
        .add(new EnlistEvent(blackIndustrialPlayerId, RecruitReward.POPULARITY, BottomAction.UPGRADE))
        .add(new EnlistEvent(blackIndustrialPlayerId, RecruitReward.POWER, BottomAction.BUILD));
    game.gainCoins(blackIndustrialPlayer);
    expect(GameInfo.gameOver(log)).toBeTruthy();
});

describe("Stars", () => {
    test("Players get a star for having maximum power", () => {
        game.log.add(new PowerEvent(blackIndustrialPlayerId, 13));
        game.bolsterPower(blackIndustrialPlayer);
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star.MAX_POWER);
    });

    test("Players get a star for having maximum popularity", () => {
        game.log.add(new PopularityEvent(blackIndustrialPlayerId, 15));
        game.tradePopularity(blackIndustrialPlayer);
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star.MAX_POPULARITY);
    });

    test("Players get a star for deploying all workers", () => {
        game.log
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.black))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.black))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_5, Field.black))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_6, Field.black))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_7, Field.black))
            .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_8, Field.black));
        game.tradePopularity(blackIndustrialPlayer);
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star.ALL_WORKERS);
    });

    test("Players get a star for deploying all mechs", () => {
        mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
        game.log
            .add(new DeployEvent(blackIndustrialPlayerId, Mech.MECH_1, Field.black))
            .add(new DeployEvent(blackIndustrialPlayerId, Mech.MECH_2, Field.black))
            .add(new DeployEvent(blackIndustrialPlayerId, Mech.MECH_3, Field.black));
        game.gainCoins(blackIndustrialPlayer);
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toEqual([]);

        game.log.add(new DeployEvent(blackIndustrialPlayerId, Mech.MECH_4, Field.black));
        game.build(
            blackIndustrialPlayer,
            Worker.WORKER_1,
            BuildingType.MINE,
            resources(Field.m6, ResourceType.WOOD, 4),
        );
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star.ALL_MECHS);
    });

    test("Players get a star for enlisting all recruiters", () => {
        game.log
            .add(new EnlistEvent(blackIndustrialPlayerId, RecruitReward.COINS, BottomAction.ENLIST))
            .add(new EnlistEvent(blackIndustrialPlayerId, RecruitReward.COMBAT_CARDS, BottomAction.DEPLOY))
            .add(new EnlistEvent(blackIndustrialPlayerId, RecruitReward.POPULARITY, BottomAction.UPGRADE))
            .add(new EnlistEvent(blackIndustrialPlayerId, RecruitReward.POWER, BottomAction.BUILD));
        game.gainCoins(blackIndustrialPlayer);
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star.ALL_RECRUITS);
    });

    test("Players get a star for building all buildings", () => {
        game.log
            .add(new BuildEvent(blackIndustrialPlayerId, workerLocation(blackIndustrialPlayer), BuildingType.ARMORY))
            .add(new BuildEvent(blackIndustrialPlayerId, workerLocation(blackIndustrialPlayer), BuildingType.MILL))
            .add(new BuildEvent(blackIndustrialPlayerId, workerLocation(blackIndustrialPlayer), BuildingType.MINE))
            .add(new BuildEvent(blackIndustrialPlayerId, workerLocation(blackIndustrialPlayer), BuildingType.MONUMENT));
        game.gainCoins(blackIndustrialPlayer);
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star.ALL_BUILDINGS);
    });

    test("Players get a star for unlocking all upgrades", () => {
        game.log
            .add(new UpgradeEvent(blackIndustrialPlayerId, TopAction.BOLSTER, BottomAction.ENLIST))
            .add(new UpgradeEvent(blackIndustrialPlayerId, TopAction.BOLSTER, BottomAction.ENLIST))
            .add(new UpgradeEvent(blackIndustrialPlayerId, TopAction.BOLSTER, BottomAction.ENLIST))
            .add(new UpgradeEvent(blackIndustrialPlayerId, TopAction.BOLSTER, BottomAction.ENLIST))
            .add(new UpgradeEvent(blackIndustrialPlayerId, TopAction.BOLSTER, BottomAction.ENLIST))
            .add(new UpgradeEvent(blackIndustrialPlayerId, TopAction.BOLSTER, BottomAction.ENLIST));
        game.gainCoins(blackIndustrialPlayer);
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toContain(Star.ALL_UPGRADES);
    });

    test.skip("Players get stars for the first two combat wins", () => {
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toEqual([Star.FIRST_COMBAT_WIN, Star.SECOND_COMBAT_WIN]);
    });

    test.skip("Players get a star for completing an objective", () => {
        expect(GameInfo.stars(log, blackIndustrialPlayer)).toEqual([Star.FIRST_COMBAT_WIN, Star.SECOND_COMBAT_WIN]);
    });
});

describe("Play order", () => {
    test("In a one player game there are no neighbors", () => {
        expect(GameInfo.neighbors([blackIndustrialPlayer], blackIndustrialPlayer)).toEqual([]);
    });

    test("In a two player game there are is only one neighbor", () => {
        expect(GameInfo.neighbors(testPlayers, blackIndustrialPlayer)).toEqual([greenAgriculturalPlayer]);
    });

    test("In a three player game all other players are neighbors", () => {
        const threePlayers = [blackIndustrialPlayer, greenAgriculturalPlayer, blueInnovativePlayer];
        expect(GameInfo.neighbors(threePlayers, blueInnovativePlayer)).toEqual([
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
        expect(GameInfo.neighbors(sevenPlayers, purpleMilitantPlayer)).toEqual([
            redPatrioticPlayer,
            yellowEngineeringPlayer,
        ]);

        expect(GameInfo.neighbors(sevenPlayers, greenAgriculturalPlayer)).toEqual([
            blueInnovativePlayer,
            whiteMechanicalPlayer,
        ]);

        expect(GameInfo.neighbors(sevenPlayers, whiteMechanicalPlayer)).toEqual([
            greenAgriculturalPlayer,
            blackIndustrialPlayer,
        ]);
    });
});

test("Cannot deploy the same mech twice", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);

    expect(() =>
        game
            .deploy(blackIndustrialPlayer, Worker.WORKER_1, Mech.MECH_1, resources(Field.m6, ResourceType.METAL, 4))
            .bolsterPower(greenAgriculturalPlayer)
            .bolsterPower(blackIndustrialPlayer)
            .tradePopularity(greenAgriculturalPlayer)
            .deploy(blackIndustrialPlayer, Worker.WORKER_1, Mech.MECH_1, resources(Field.m6, ResourceType.METAL, 4)),
    ).toThrowError("MECH_1 has already been deployed.");
});

test.skip("Upgrade makes a top action more powerful and a bottom action cheaper", () => {
    mockResourcesAndCoinsForPlayer(blackIndustrialPlayer);
    game.upgrade(
        blackIndustrialPlayer,
        TopAction.BOLSTER,
        BottomAction.BUILD,
        resources(Field.t8, ResourceType.METAL, 4),
    );
});

test("Player cannot gain more than 16 power", () => {
    game.log.add(new PowerEvent(blackIndustrialPlayerId, 15)); // total now 16
    game.bolsterPower(blackIndustrialPlayer);
    expect(GameInfo.power(log, blackIndustrialPlayer)).toBe(16);
});

test("Player cannot gain more than 18 popularity", () => {
    game.log.add(new PopularityEvent(blackIndustrialPlayerId, 16)); // total now 18
    game.tradePopularity(blackIndustrialPlayer);
    expect(GameInfo.popularity(log, blackIndustrialPlayer)).toBe(18);
});

test.skip("Buildings cannot be placed on home territories", fail);
test.skip("Mechs cannot be placed on home territories", fail);
test.skip("Buildings cannot be placed on lakes", fail);
test.skip("Cannot move the same unit multiple times", fail);

export const resources = (location: Field, resourceType: ResourceType, count: number = 10): Resource[] => {
    const res: Resource[] = [];
    for (let i = 0; i < count; ++i) {
        res.push(new Resource(location, resourceType));
    }
    return res;
};

const workerLocation = (player: Player) => GameInfo.unitLocation(log, player, Worker.WORKER_1);

const addResourcesForPlayer = (player: Player, resourceType: ResourceType, count: number) => {
    game.log.add(new GainResourceEvent(player.playerId, resources(workerLocation(player), resourceType, count)));
};

const mockResourcesAndCoinsForPlayer = (player: Player) => {
    const location = workerLocation(player);
    game.log
        .add(new GainResourceEvent(player.playerId, resources(location, ResourceType.METAL)))
        .add(new GainResourceEvent(player.playerId, resources(location, ResourceType.WOOD)))
        .add(new GainResourceEvent(player.playerId, resources(location, ResourceType.OIL)))
        .add(new GainResourceEvent(player.playerId, resources(location, ResourceType.FOOD)))
        .add(new CoinEvent(player.playerId, 10));
};

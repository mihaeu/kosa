import {
    availableBolsterOptions,
    availableBuildOptions,
    availableDeployOptions,
    availableMoveOptions,
    availableProduceOptions,
    availableTradeOptions,
    availableUpgradeOptions,
} from "../src/Availability";
import { BottomAction } from "../src/BottomAction";
import { BuildingType } from "../src/BuildingType";
import { BuildEvent } from "../src/Events/BuildEvent";
import { DeployEvent } from "../src/Events/DeployEvent";
import { EventLog } from "../src/Events/EventLog";
import { GainResourceEvent } from "../src/Events/GainResourceEvent";
import { MoveEvent } from "../src/Events/MoveEvent";
import { Field } from "../src/Field";
import { Game } from "../src/Game";
import { BuildOption } from "../src/Options/BuildOption";
import { DeployOption } from "../src/Options/DeployOption";
import { ProduceOption } from "../src/Options/ProduceOption";
import { RewardOnlyOption } from "../src/Options/RewardOnlyOption";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";
import { Resource } from "../src/Resource";
import { ResourceType } from "../src/ResourceType";
import { TopAction } from "../src/TopAction";
import { Mech } from "../src/Units/Mech";
import { Worker } from "../src/Units/Worker";
import { resources } from "./Game.test";

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
let log: EventLog;

beforeEach(() => {
    log = new EventLog();
    game = new Game([blackIndustrialPlayer, greenAgriculturalPlayer], log);
});

describe("Options", () => {
    describe(TopAction.BOLSTER, () => {
        test("If player can bolster there are two options", () => {
            expect(availableBolsterOptions(log, blackIndustrialPlayer).length).toBe(2);
        });

        test("If player cannot bolster there are no options", () => {
            game.bolsterPower(blackIndustrialPlayer);
            expect(availableBolsterOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });

    describe(TopAction.TRADE, () => {
        test("If player can bolster there are two options", () => {
            expect(availableTradeOptions(log, blackIndustrialPlayer).length).toBe(17);
        });

        test("If player cannot trade there are no options", () => {
            game.tradePopularity(blackIndustrialPlayer);
            expect(availableTradeOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });

    describe(TopAction.PRODUCE, () => {
        test("If player has workers on one field there is only 1 option with one field", () => {
            game.log.add(new MoveEvent(blackIndustrialPlayerId, Worker.WORKER_1, Field.t8));
            expect(availableProduceOptions(log, blackIndustrialPlayer).pop()).toEqual(new ProduceOption([Field.t8]));
        });

        test("If player has workers on two fields there is only 1 option with two fields", () => {
            expect(availableProduceOptions(log, blackIndustrialPlayer).pop()).toEqual(
                new ProduceOption([Field.m6, Field.t8]),
            );
        });

        test("If player has workers on three fields there are 3 options", () => {
            game.log.add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.v6));
            expect(availableProduceOptions(log, blackIndustrialPlayer)).toEqual([
                new ProduceOption([Field.m6, Field.t8]),
                new ProduceOption([Field.m6, Field.v6]),
                new ProduceOption([Field.t8, Field.v6]),
            ]);
        });

        test("If player has workers on four fields there are 6 options", () => {
            game.log.add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.v6));
            game.log.add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_4, Field.f5));
            expect(availableProduceOptions(log, blackIndustrialPlayer).length).toEqual(6);
        });

        test("If player cannot produce there are no options", () => {
            game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
            expect(availableProduceOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });

    describe(TopAction.MOVE, () => {
        test("Players on their starting position have 22 move options", () => {
            expect(availableMoveOptions(log, blackIndustrialPlayer).length).toBe(22);
        });

        test("Player with starting position and one mech on factory has 46 moves", () => {
            game.log.add(new DeployEvent(blackIndustrialPlayerId, Mech.MECH_1, Field.F));
            expect(availableMoveOptions(log, blackIndustrialPlayer).length).toBe(46);
        });

        test("If player cannot move there are no options", () => {
            game.gainCoins(blackIndustrialPlayer);
            expect(availableMoveOptions(log, blackIndustrialPlayer)).toEqual([]);
        });
    });

    describe(BottomAction.BUILD, () => {
        beforeEach(() =>
            game.log.add(
                new GainResourceEvent(blackIndustrialPlayerId, [
                    new Resource(Field.m6, ResourceType.WOOD),
                    new Resource(Field.m6, ResourceType.WOOD),
                    new Resource(Field.m6, ResourceType.WOOD),
                ]),
            ),
        );

        test("Players can build two building for the starting position", () => {
            expect(availableBuildOptions(log, blackIndustrialPlayer)).toEqual([
                new RewardOnlyOption(BottomAction.BUILD),
                new BuildOption(Worker.WORKER_1, BuildingType.MONUMENT),
                new BuildOption(Worker.WORKER_1, BuildingType.MILL),
                new BuildOption(Worker.WORKER_1, BuildingType.MINE),
                new BuildOption(Worker.WORKER_1, BuildingType.ARMORY),
                new BuildOption(Worker.WORKER_2, BuildingType.MONUMENT),
                new BuildOption(Worker.WORKER_2, BuildingType.MILL),
                new BuildOption(Worker.WORKER_2, BuildingType.MINE),
                new BuildOption(Worker.WORKER_2, BuildingType.ARMORY),
            ]);
        });

        test("Players can build only two buildings if two have already been build", () => {
            log
                .add(new BuildEvent(blackIndustrialPlayerId, Field.m6, BuildingType.ARMORY))
                .add(new BuildEvent(blackIndustrialPlayerId, Field.t8, BuildingType.MILL))
                .add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.F));
            expect(availableBuildOptions(log, blackIndustrialPlayer)).toEqual([
                new RewardOnlyOption(BottomAction.BUILD),
                new BuildOption(Worker.WORKER_3, BuildingType.MONUMENT),
                new BuildOption(Worker.WORKER_3, BuildingType.MINE),
            ]);
        });

        test("If player cannot build there are no options", () => {
            game.build(
                blackIndustrialPlayer,
                Worker.WORKER_1,
                BuildingType.MONUMENT,
                resources(Field.m6, ResourceType.WOOD, 4),
            );
            expect(availableBuildOptions(log, blackIndustrialPlayer)).toEqual([]);
        });
    });

    describe(BottomAction.DEPLOY, () => {
        beforeEach(() =>
            game.log.add(
                new GainResourceEvent(blackIndustrialPlayerId, [
                    new Resource(Field.m6, ResourceType.METAL),
                    new Resource(Field.m6, ResourceType.METAL),
                    new Resource(Field.m6, ResourceType.METAL),
                    new Resource(Field.m6, ResourceType.METAL),
                ]),
            ),
        );

        test("Players can deploy for mechs in two positions for starting position", () => {
            expect(availableDeployOptions(log, blackIndustrialPlayer)).toEqual([
                new RewardOnlyOption(BottomAction.DEPLOY),
                new DeployOption(Worker.WORKER_1, Mech.MECH_1),
                new DeployOption(Worker.WORKER_2, Mech.MECH_1),
                new DeployOption(Worker.WORKER_1, Mech.MECH_2),
                new DeployOption(Worker.WORKER_2, Mech.MECH_2),
                new DeployOption(Worker.WORKER_1, Mech.MECH_3),
                new DeployOption(Worker.WORKER_2, Mech.MECH_3),
                new DeployOption(Worker.WORKER_1, Mech.MECH_4),
                new DeployOption(Worker.WORKER_2, Mech.MECH_4),
            ]);
        });

        test("If player cannot deploy there are no options", () => {
            game.deploy(
                blackIndustrialPlayer,
                Worker.WORKER_1,
                Mech.MECH_1,
                resources(Field.m6, ResourceType.METAL, 4),
            );
            expect(availableDeployOptions(log, blackIndustrialPlayer)).toEqual([]);
        });
    });

    describe(BottomAction.UPGRADE, () => {
        test.skip("Implement me", fail);

        test("If player cannot upgrade there are no options", () => {
            game.log.add(
                new GainResourceEvent(blackIndustrialPlayerId, [
                    new Resource(Field.m6, ResourceType.OIL),
                    new Resource(Field.m6, ResourceType.OIL),
                    new Resource(Field.m6, ResourceType.OIL),
                    new Resource(Field.m6, ResourceType.OIL),
                ]),
            );
            game.upgrade(
                blackIndustrialPlayer,
                TopAction.MOVE,
                BottomAction.DEPLOY,
                resources(Field.m6, ResourceType.OIL, 4),
            );
            expect(availableUpgradeOptions(log, blackIndustrialPlayer)).toEqual([]);
        });
    });

    describe(BottomAction.ENLIST, () => {
        test.skip("Implement me", fail);
    });
});

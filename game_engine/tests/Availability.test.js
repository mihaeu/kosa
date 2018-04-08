"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Availability_1 = require("../src/Availability");
const BottomAction_1 = require("../src/BottomAction");
const BuildingType_1 = require("../src/BuildingType");
const BuildEvent_1 = require("../src/Events/BuildEvent");
const DeployEvent_1 = require("../src/Events/DeployEvent");
const EventLog_1 = require("../src/Events/EventLog");
const GainResourceEvent_1 = require("../src/Events/GainResourceEvent");
const MoveEvent_1 = require("../src/Events/MoveEvent");
const Field_1 = require("../src/Field");
const Game_1 = require("../src/Game");
const BuildOption_1 = require("../src/Options/BuildOption");
const DeployOption_1 = require("../src/Options/DeployOption");
const ProduceOption_1 = require("../src/Options/ProduceOption");
const RewardOnlyOption_1 = require("../src/Options/RewardOnlyOption");
const PlayerFactory_1 = require("../src/PlayerFactory");
const PlayerMat_1 = require("../src/PlayerMat");
const Resource_1 = require("../src/Resource");
const ResourceType_1 = require("../src/ResourceType");
const TopAction_1 = require("../src/TopAction");
const Mech_1 = require("../src/Units/Mech");
const Worker_1 = require("../src/Units/Worker");
const Game_test_1 = require("./Game.test");
let game;
const blackIndustrialPlayerId = "1";
const greenAgriculturalPlayerId = "2";
const blackIndustrialPlayer = PlayerFactory_1.PlayerFactory.black(blackIndustrialPlayerId, PlayerMat_1.PlayerMat.industrial(blackIndustrialPlayerId));
const greenAgriculturalPlayer = PlayerFactory_1.PlayerFactory.green(greenAgriculturalPlayerId, PlayerMat_1.PlayerMat.agricultural(greenAgriculturalPlayerId));
let log;
beforeEach(() => {
    log = new EventLog_1.EventLog();
    game = new Game_1.Game([blackIndustrialPlayer, greenAgriculturalPlayer], log);
});
describe("Options", () => {
    describe(TopAction_1.TopAction.BOLSTER, () => {
        test("If player can bolster there are two options", () => {
            expect(Availability_1.availableBolsterOptions(log, blackIndustrialPlayer).length).toBe(2);
        });
        test("If player cannot bolster there are no options", () => {
            game.bolsterPower(blackIndustrialPlayer);
            expect(Availability_1.availableBolsterOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });
    describe(TopAction_1.TopAction.TRADE, () => {
        test("If player can bolster there are two options", () => {
            expect(Availability_1.availableTradeOptions(log, blackIndustrialPlayer).length).toBe(17);
        });
        test("If player cannot trade there are no options", () => {
            game.tradePopularity(blackIndustrialPlayer);
            expect(Availability_1.availableTradeOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });
    describe(TopAction_1.TopAction.PRODUCE, () => {
        test("If player has workers on one field there is only 1 option with one field", () => {
            game.log.add(new MoveEvent_1.MoveEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_1, Field_1.Field.t8));
            expect(Availability_1.availableProduceOptions(log, blackIndustrialPlayer).pop()).toEqual(new ProduceOption_1.ProduceOption([Field_1.Field.t8]));
        });
        test("If player has workers on two fields there is only 1 option with two fields", () => {
            expect(Availability_1.availableProduceOptions(log, blackIndustrialPlayer).pop()).toEqual(new ProduceOption_1.ProduceOption([Field_1.Field.m6, Field_1.Field.t8]));
        });
        test("If player has workers on three fields there are 3 options", () => {
            game.log.add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.v6));
            expect(Availability_1.availableProduceOptions(log, blackIndustrialPlayer)).toEqual([
                new ProduceOption_1.ProduceOption([Field_1.Field.m6, Field_1.Field.t8]),
                new ProduceOption_1.ProduceOption([Field_1.Field.m6, Field_1.Field.v6]),
                new ProduceOption_1.ProduceOption([Field_1.Field.t8, Field_1.Field.v6]),
            ]);
        });
        test("If player has workers on four fields there are 6 options", () => {
            game.log.add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.v6));
            game.log.add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_4, Field_1.Field.f5));
            expect(Availability_1.availableProduceOptions(log, blackIndustrialPlayer).length).toEqual(6);
        });
        test("If player cannot produce there are no options", () => {
            game.produce(blackIndustrialPlayer, Field_1.Field.m6, Field_1.Field.t8);
            expect(Availability_1.availableProduceOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });
    describe(TopAction_1.TopAction.MOVE, () => {
        test("Players on their starting position have 22 move options", () => {
            expect(Availability_1.availableMoveOptions(log, blackIndustrialPlayer).length).toBe(22);
        });
        test("Player with starting position and one mech on factory has 46 moves", () => {
            game.log.add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Mech_1.Mech.MECH_1, Field_1.Field.F));
            expect(Availability_1.availableMoveOptions(log, blackIndustrialPlayer).length).toBe(46);
        });
        test("If player cannot move there are no options", () => {
            game.gainCoins(blackIndustrialPlayer);
            expect(Availability_1.availableMoveOptions(log, blackIndustrialPlayer)).toEqual([]);
        });
    });
    describe(BottomAction_1.BottomAction.BUILD, () => {
        beforeEach(() => game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, [
            new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD),
            new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD),
            new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD),
        ])));
        test("Players can build two building for the starting position", () => {
            expect(Availability_1.availableBuildOptions(log, blackIndustrialPlayer)).toEqual([
                new RewardOnlyOption_1.RewardOnlyOption(BottomAction_1.BottomAction.BUILD),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MONUMENT),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MILL),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MINE),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.ARMORY),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_2, BuildingType_1.BuildingType.MONUMENT),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_2, BuildingType_1.BuildingType.MILL),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_2, BuildingType_1.BuildingType.MINE),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_2, BuildingType_1.BuildingType.ARMORY),
            ]);
        });
        test("Players can build only two buildings if two have already been build", () => {
            log
                .add(new BuildEvent_1.BuildEvent(blackIndustrialPlayerId, Field_1.Field.m6, BuildingType_1.BuildingType.ARMORY))
                .add(new BuildEvent_1.BuildEvent(blackIndustrialPlayerId, Field_1.Field.t8, BuildingType_1.BuildingType.MILL))
                .add(new DeployEvent_1.DeployEvent(blackIndustrialPlayerId, Worker_1.Worker.WORKER_3, Field_1.Field.F));
            expect(Availability_1.availableBuildOptions(log, blackIndustrialPlayer)).toEqual([
                new RewardOnlyOption_1.RewardOnlyOption(BottomAction_1.BottomAction.BUILD),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_3, BuildingType_1.BuildingType.MONUMENT),
                new BuildOption_1.BuildOption(Worker_1.Worker.WORKER_3, BuildingType_1.BuildingType.MINE),
            ]);
        });
        test("If player cannot build there are no options", () => {
            game.build(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MONUMENT, Game_test_1.resources(Field_1.Field.m6, ResourceType_1.ResourceType.WOOD, 4));
            expect(Availability_1.availableBuildOptions(log, blackIndustrialPlayer)).toEqual([]);
        });
    });
    describe(BottomAction_1.BottomAction.DEPLOY, () => {
        beforeEach(() => game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, [
            new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
            new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
            new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
            new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.METAL),
        ])));
        test("Players can deploy for mechs in two positions for starting position", () => {
            expect(Availability_1.availableDeployOptions(log, blackIndustrialPlayer)).toEqual([
                new RewardOnlyOption_1.RewardOnlyOption(BottomAction_1.BottomAction.DEPLOY),
                new DeployOption_1.DeployOption(Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_1),
                new DeployOption_1.DeployOption(Worker_1.Worker.WORKER_2, Mech_1.Mech.MECH_1),
                new DeployOption_1.DeployOption(Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_2),
                new DeployOption_1.DeployOption(Worker_1.Worker.WORKER_2, Mech_1.Mech.MECH_2),
                new DeployOption_1.DeployOption(Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_3),
                new DeployOption_1.DeployOption(Worker_1.Worker.WORKER_2, Mech_1.Mech.MECH_3),
                new DeployOption_1.DeployOption(Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_4),
                new DeployOption_1.DeployOption(Worker_1.Worker.WORKER_2, Mech_1.Mech.MECH_4),
            ]);
        });
        test("If player cannot deploy there are no options", () => {
            game.deploy(blackIndustrialPlayer, Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_1, Game_test_1.resources(Field_1.Field.m6, ResourceType_1.ResourceType.METAL, 4));
            expect(Availability_1.availableDeployOptions(log, blackIndustrialPlayer)).toEqual([]);
        });
    });
    describe(BottomAction_1.BottomAction.UPGRADE, () => {
        test.skip("Implement me", fail);
        test("If player cannot upgrade there are no options", () => {
            game.log.add(new GainResourceEvent_1.GainResourceEvent(blackIndustrialPlayerId, [
                new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.OIL),
                new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.OIL),
                new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.OIL),
                new Resource_1.Resource(Field_1.Field.m6, ResourceType_1.ResourceType.OIL),
            ]));
            game.upgrade(blackIndustrialPlayer, TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.DEPLOY, Game_test_1.resources(Field_1.Field.m6, ResourceType_1.ResourceType.OIL, 4));
            expect(Availability_1.availableUpgradeOptions(log, blackIndustrialPlayer)).toEqual([]);
        });
    });
    describe(BottomAction_1.BottomAction.ENLIST, () => {
        test.skip("Implement me", fail);
    });
});

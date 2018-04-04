"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BottomAction_1 = require("../src/BottomAction");
const BuildingType_1 = require("../src/BuildingType");
const EventLog_1 = require("../src/Events/EventLog");
const Field_1 = require("../src/Field");
const Game_1 = require("../src/Game");
const GameInfo_1 = require("../src/GameInfo");
const Move_1 = require("../src/Move");
const PlayerFactory_1 = require("../src/PlayerFactory");
const PlayerId_1 = require("../src/PlayerId");
const PlayerMat_1 = require("../src/PlayerMat");
const RecruitReward_1 = require("../src/RecruitReward");
const Resource_1 = require("../src/Resource");
const ResourceType_1 = require("../src/ResourceType");
const Star_1 = require("../src/Star");
const Mech_1 = require("../src/Units/Mech");
const Worker_1 = require("../src/Units/Worker");
test("Single player game finishes with fixed play sequence", () => {
    const playerId = new PlayerId_1.PlayerId(1);
    const player = PlayerFactory_1.PlayerFactory.green(playerId, PlayerMat_1.PlayerMat.industrial(playerId));
    const log = new EventLog_1.EventLog();
    const players = [player];
    const game = new Game_1.Game(players, log);
    for (let i = 0; i < 16; i += 1) {
        game.gainCoins(player);
        game.tradePopularity(player);
        game.gainCoins(player);
        game.bolsterPower(player);
        game.produce(player, Field_1.Field.m1, Field_1.Field.f1);
    }
    game.gainCoins(player);
    game.tradePopularity(player);
    game.gainCoins(player);
    game.tradePopularity(player);
    expect(GameInfo_1.GameInfo.stars(log, player)).toContain(Star_1.Star.MAX_POPULARITY);
    expect(GameInfo_1.GameInfo.stars(log, player)).toContain(Star_1.Star.MAX_POWER);
    game.enlist(player, BottomAction_1.BottomAction.UPGRADE, RecruitReward_1.RecruitReward.POPULARITY, [
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
    ]);
    game.gainCoins(player);
    game.enlist(player, BottomAction_1.BottomAction.ENLIST, RecruitReward_1.RecruitReward.COMBAT_CARDS, [
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
    ]);
    game.gainCoins(player);
    game.enlist(player, BottomAction_1.BottomAction.DEPLOY, RecruitReward_1.RecruitReward.COINS, [
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
    ]);
    game.gainCoins(player);
    game.enlist(player, BottomAction_1.BottomAction.BUILD, RecruitReward_1.RecruitReward.POWER, [
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
        new Resource_1.Resource(Field_1.Field.f1, ResourceType_1.ResourceType.FOOD),
    ]);
    expect(GameInfo_1.GameInfo.stars(log, player)).toContain(Star_1.Star.ALL_RECRUITS);
    game.move(player, new Move_1.Move(Worker_1.Worker.WORKER_2, Field_1.Field.v1));
    game.produce(player, Field_1.Field.m1, Field_1.Field.v1);
    game.gainCoins(player);
    game.produce(player, Field_1.Field.m1, Field_1.Field.v1);
    game.bolsterPower(player);
    game.gainCoins(player);
    game.produce(player, Field_1.Field.m1, Field_1.Field.v1);
    expect(GameInfo_1.GameInfo.stars(log, player)).toContain(Star_1.Star.ALL_WORKERS);
    game.move(player, new Move_1.Move(Worker_1.Worker.WORKER_3, Field_1.Field.f1));
    game.tradeResources(player, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.WOOD);
    game.gainCoins(player);
    game.tradeResources(player, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.WOOD);
    game.move(player, new Move_1.Move(Worker_1.Worker.WORKER_4, Field_1.Field.f1));
    game.build(player, Worker_1.Worker.WORKER_1, BuildingType_1.BuildingType.MINE, [
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
    ]);
    game.deploy(player, Worker_1.Worker.WORKER_1, Mech_1.Mech.MECH_1, [
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
    ]);
    game.move(player, new Move_1.Move(Worker_1.Worker.WORKER_4, Field_1.Field.t2));
    game.deploy(player, Worker_1.Worker.WORKER_2, Mech_1.Mech.MECH_2, [
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
    ]);
    game.tradeResources(player, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.WOOD);
    game.deploy(player, Worker_1.Worker.WORKER_3, Mech_1.Mech.MECH_3, [
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
    ]);
    game.tradeResources(player, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.WOOD);
    game.deploy(player, Worker_1.Worker.WORKER_4, Mech_1.Mech.MECH_4, [
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.METAL),
    ]);
    expect(GameInfo_1.GameInfo.stars(log, player)).toContain(Star_1.Star.ALL_MECHS);
    game.build(player, Worker_1.Worker.WORKER_2, BuildingType_1.BuildingType.MILL, [
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
    ]);
    game.tradeResources(player, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.WOOD);
    game.build(player, Worker_1.Worker.WORKER_3, BuildingType_1.BuildingType.ARMORY, [
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
    ]);
    game.tradeResources(player, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.WOOD);
    game.build(player, Worker_1.Worker.WORKER_4, BuildingType_1.BuildingType.MONUMENT, [
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
        new Resource_1.Resource(Field_1.Field.m1, ResourceType_1.ResourceType.WOOD),
    ]);
    expect(GameInfo_1.GameInfo.stars(log, player)).toContain(Star_1.Star.ALL_MECHS);
    expect(GameInfo_1.GameInfo.gameOver(log)).toBeTruthy();
});

"use strict";
exports.__esModule = true;
var BottomAction_1 = require("../src/BottomAction");
var BuildingType_1 = require("../src/BuildingType");
var Field_1 = require("../src/Field");
var Game_1 = require("../src/Game");
var PlayerFactory_1 = require("../src/PlayerFactory");
var PlayerId_1 = require("../src/PlayerId");
var PlayerMat_1 = require("../src/PlayerMat");
var RecruitReward_1 = require("../src/RecruitReward");
var Resource_1 = require("../src/Resource");
var ResourceType_1 = require("../src/ResourceType");
var Mech_1 = require("../src/Units/Mech");
var Worker_1 = require("../src/Units/Worker");
for (var j = 0; j <= 1000; j += 1) {
    var playerId = new PlayerId_1.PlayerId(1);
    var player = PlayerFactory_1.PlayerFactory.green(playerId, PlayerMat_1.PlayerMat.industrial(playerId));
    var game = new Game_1.Game([player]);
    for (var i = 0; i < 16; i += 1) {
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
    game.move(player, Worker_1.Worker.WORKER_2, Field_1.Field.v1);
    game.produce(player, Field_1.Field.m1, Field_1.Field.v1);
    game.gainCoins(player);
    game.produce(player, Field_1.Field.m1, Field_1.Field.v1);
    game.bolsterPower(player);
    game.gainCoins(player);
    game.produce(player, Field_1.Field.m1, Field_1.Field.v1);
    game.move(player, Worker_1.Worker.WORKER_3, Field_1.Field.f1);
    game.tradeResources(player, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.WOOD);
    game.gainCoins(player);
    game.tradeResources(player, Worker_1.Worker.WORKER_1, ResourceType_1.ResourceType.WOOD, ResourceType_1.ResourceType.WOOD);
    game.move(player, Worker_1.Worker.WORKER_4, Field_1.Field.f1);
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
    game.move(player, Worker_1.Worker.WORKER_4, Field_1.Field.t2);
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
}

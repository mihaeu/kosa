import { BottomAction } from "../src/BottomAction";
import { BuildingType } from "../src/BuildingType";
import { EventLog } from "../src/Events/EventLog";
import { Field } from "../src/Field";
import { Game } from "../src/Game";
import { GameInfo } from "../src/GameInfo";
import { Move } from "../src/Move";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";
import { RecruitReward } from "../src/RecruitReward";
import { Resource } from "../src/Resource";
import { ResourceType } from "../src/ResourceType";
import { Star } from "../src/Star";
import { Mech } from "../src/Units/Mech";
import { Worker } from "../src/Units/Worker";

test("Single player game finishes with fixed play sequence", () => {
    const playerId = new PlayerId(1);
    const player = PlayerFactory.green(playerId, PlayerMat.industrial(playerId));
    const log = new EventLog();
    const players = [player];
    const game = new Game(players, log);

    for (let i = 0; i < 16; i += 1) {
        game.gainCoins(player);
        game.tradePopularity(player);
        game.gainCoins(player);
        game.bolsterPower(player);
        game.produce(player, Field.m1, Field.f1);
    }

    game.gainCoins(player);
    game.tradePopularity(player);
    game.gainCoins(player);
    game.tradePopularity(player);

    expect(GameInfo.stars(log, player)).toContain(Star.MAX_POPULARITY);
    expect(GameInfo.stars(log, player)).toContain(Star.MAX_POWER);

    game.enlist(player, BottomAction.UPGRADE, RecruitReward.POPULARITY, [
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
    ]);
    game.gainCoins(player);
    game.enlist(player, BottomAction.ENLIST, RecruitReward.COMBAT_CARDS, [
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
    ]);
    game.gainCoins(player);
    game.enlist(player, BottomAction.DEPLOY, RecruitReward.COINS, [
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
    ]);
    game.gainCoins(player);
    game.enlist(player, BottomAction.BUILD, RecruitReward.POWER, [
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
        new Resource(Field.f1, ResourceType.FOOD),
    ]);

    expect(GameInfo.stars(log, player)).toContain(Star.ALL_RECRUITS);

    game.move(player, new Move(Worker.WORKER_2, Field.v1));
    game.produce(player, Field.m1, Field.v1);
    game.gainCoins(player);
    game.produce(player, Field.m1, Field.v1);
    game.bolsterPower(player);
    game.gainCoins(player);
    game.produce(player, Field.m1, Field.v1);

    expect(GameInfo.stars(log, player)).toContain(Star.ALL_WORKERS);

    game.move(player, new Move(Worker.WORKER_3, Field.f1));
    game.tradeResources(player, Worker.WORKER_1, ResourceType.WOOD, ResourceType.WOOD);
    game.gainCoins(player);
    game.tradeResources(player, Worker.WORKER_1, ResourceType.WOOD, ResourceType.WOOD);
    game.move(player, new Move(Worker.WORKER_4, Field.f1));
    game.build(player, Worker.WORKER_1, BuildingType.MINE, [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ]);
    game.deploy(player, Worker.WORKER_1, Mech.MECH_1, [
        new Resource(Field.m1, ResourceType.METAL),
        new Resource(Field.m1, ResourceType.METAL),
        new Resource(Field.m1, ResourceType.METAL),
    ]);
    game.move(player, new Move(Worker.WORKER_4, Field.t2));
    game.deploy(player, Worker.WORKER_2, Mech.MECH_2, [
        new Resource(Field.m1, ResourceType.METAL),
        new Resource(Field.m1, ResourceType.METAL),
        new Resource(Field.m1, ResourceType.METAL),
    ]);
    game.tradeResources(player, Worker.WORKER_1, ResourceType.WOOD, ResourceType.WOOD);
    game.deploy(player, Worker.WORKER_3, Mech.MECH_3, [
        new Resource(Field.m1, ResourceType.METAL),
        new Resource(Field.m1, ResourceType.METAL),
        new Resource(Field.m1, ResourceType.METAL),
    ]);

    game.tradeResources(player, Worker.WORKER_1, ResourceType.WOOD, ResourceType.WOOD);
    game.deploy(player, Worker.WORKER_4, Mech.MECH_4, [
        new Resource(Field.m1, ResourceType.METAL),
        new Resource(Field.m1, ResourceType.METAL),
        new Resource(Field.m1, ResourceType.METAL),
    ]);

    expect(GameInfo.stars(log, player)).toContain(Star.ALL_MECHS);

    game.build(player, Worker.WORKER_2, BuildingType.MILL, [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ]);
    game.tradeResources(player, Worker.WORKER_1, ResourceType.WOOD, ResourceType.WOOD);
    game.build(player, Worker.WORKER_3, BuildingType.ARMORY, [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ]);
    game.tradeResources(player, Worker.WORKER_1, ResourceType.WOOD, ResourceType.WOOD);
    game.build(player, Worker.WORKER_4, BuildingType.MONUMENT, [
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
        new Resource(Field.m1, ResourceType.WOOD),
    ]);

    expect(GameInfo.stars(log, player)).toContain(Star.ALL_MECHS);
    expect(GameInfo.gameOver(log)).toBeTruthy();
});

import { BottomAction } from "../src/BottomAction";
import { GameEndEvent } from "../src/Events/GameEndEvent";
import { Field } from "../src/Field";
import { Game } from "../src/Game";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";
import { RecruitReward } from "../src/RecruitReward";
import { Resource } from "../src/Resource";
import { ResourceType } from "../src/ResourceType";
import { Star } from "../src/Star";
import { Worker } from "../src/Units/Worker";

test("Single player game finishes eventually", () => {
    const playerId = new PlayerId(1);
    const player = PlayerFactory.green(playerId, PlayerMat.industrial(playerId));
    const game = new Game([player]);
    game
        .gainCoins(player)
        .tradePopularity(player)
        .bolsterPower(player)
        .gainCoins(player)
        .tradePopularity(player)
        .bolsterPower(player)
        .gainCoins(player)
        .tradePopularity(player)
        .bolsterPower(player)
        .gainCoins(player)
        .tradePopularity(player)
        .bolsterPower(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .bolsterPower(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .bolsterPower(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .bolsterPower(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .bolsterPower(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .tradePopularity(player)
        .gainCoins(player)
        .tradePopularity(player);

    expect(game.stars(player)).toContain(Star.MAX_POPULARITY);
    expect(game.stars(player)).toContain(Star.MAX_POWER);

    game
        .gainCoins(player)
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)
        .gainCoins(player)
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)
        .enlist(player, BottomAction.UPGRADE, RecruitReward.POPULARITY, [
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
        ])
        .gainCoins(player)
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)
        .gainCoins(player)
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)
        .enlist(player, BottomAction.ENLIST, RecruitReward.COMBAT_CARDS, [
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
        ])
        .gainCoins(player)
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)
        .gainCoins(player)
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)
        .enlist(player, BottomAction.DEPLOY, RecruitReward.COINS, [
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
        ])
        .gainCoins(player)
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)
        .gainCoins(player)
        .tradeResources(player, Worker.WORKER_1, ResourceType.FOOD, ResourceType.FOOD)
        .enlist(player, BottomAction.BUILD, RecruitReward.POWER, [
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
            new Resource(Field.m1, ResourceType.FOOD),
        ]);

    expect(game.stars(player)).toContain(Star.ALL_RECRUITS);

    // @TODO produce workers
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("ramda");
const Availability_1 = require("./Availability");
const BottomAction_1 = require("./BottomAction");
const CombatCard_1 = require("./CombatCard");
const ActionEvent_1 = require("./Events/ActionEvent");
const BuildEvent_1 = require("./Events/BuildEvent");
const CoinEvent_1 = require("./Events/CoinEvent");
const DeployEvent_1 = require("./Events/DeployEvent");
const EnlistEvent_1 = require("./Events/EnlistEvent");
const EventLog_1 = require("./Events/EventLog");
const GainCombatCardEvent_1 = require("./Events/GainCombatCardEvent");
const GainResourceEvent_1 = require("./Events/GainResourceEvent");
const GameEndEvent_1 = require("./Events/GameEndEvent");
const MoveEvent_1 = require("./Events/MoveEvent");
const NewPlayerEvent_1 = require("./Events/NewPlayerEvent");
const PassEvent_1 = require("./Events/PassEvent");
const PopularityEvent_1 = require("./Events/PopularityEvent");
const PowerEvent_1 = require("./Events/PowerEvent");
const SpendResourceEvent_1 = require("./Events/SpendResourceEvent");
const StarEvent_1 = require("./Events/StarEvent");
const UpgradeEvent_1 = require("./Events/UpgradeEvent");
const FieldType_1 = require("./FieldType");
const GameInfo_1 = require("./GameInfo");
const GameMap_1 = require("./GameMap");
const GameSetupError_1 = require("./GameSetupError");
const BolsterCombatCardsOption_1 = require("./Options/BolsterCombatCardsOption");
const BolsterPowerOption_1 = require("./Options/BolsterPowerOption");
const BuildOption_1 = require("./Options/BuildOption");
const DeployOption_1 = require("./Options/DeployOption");
const EnlistOption_1 = require("./Options/EnlistOption");
const GainCoinOption_1 = require("./Options/GainCoinOption");
const MoveOption_1 = require("./Options/MoveOption");
const ProduceOption_1 = require("./Options/ProduceOption");
const RewardOnlyOption_1 = require("./Options/RewardOnlyOption");
const TradePopularityOption_1 = require("./Options/TradePopularityOption");
const TradeResourcesOption_1 = require("./Options/TradeResourcesOption");
const UpgradeOption_1 = require("./Options/UpgradeOption");
const Resource_1 = require("./Resource");
const ResourceType_1 = require("./ResourceType");
const Star_1 = require("./Star");
const TopAction_1 = require("./TopAction");
const Worker_1 = require("./Units/Worker");
class Game {
    constructor(players, log = new EventLog_1.EventLog()) {
        this.players = players;
        this.log = log;
        Game.assertPlayerCount(players);
        Game.assertPlayersHaveDifferentIds(players);
        Game.assertFactionAndPlayerMatMatching(players);
        this.players = players;
        this.log = log;
        players.forEach((player) => log.add(new NewPlayerEvent_1.NewPlayerEvent(player.playerId, player)));
        for (const player of players) {
            player.setupEvents.forEach((event) => this.log.add(event));
            player.playerMat.setupEvents.forEach((event) => this.log.add(event));
        }
    }
    static assertPlayerCount(players) {
        if (players.length < 1 || players.length > Game.MAX_PLAYERS) {
            throw new GameSetupError_1.GameSetupError("The game requires 1-7 players.");
        }
    }
    static assertPlayersHaveDifferentIds(players) {
        if (players.length !== _.uniq(_.pluck("playerId", players)).length) {
            throw new GameSetupError_1.GameSetupError("Some players have identical PlayerIds.");
        }
    }
    static assertFactionAndPlayerMatMatching(players) {
        const playerMats = [];
        const factions = [];
        for (const player of players) {
            if (_.contains(player.faction, factions) || _.contains(player.playerMat, playerMats)) {
                throw new GameSetupError_1.GameSetupError("Each faction and player mat is only allowed once.");
            }
            factions.push(player.faction);
            playerMats.push(player.playerMat);
        }
    }
    actionFromOption(player, option) {
        if (option instanceof BolsterCombatCardsOption_1.BolsterCombatCardsOption) {
            this.bolsterCombatCards(player);
        }
        if (option instanceof BolsterPowerOption_1.BolsterPowerOption) {
            this.bolsterPower(player);
        }
        if (option instanceof BuildOption_1.BuildOption) {
            this.build(player, option.worker, option.buildingType, GameInfo_1.GameInfo.availableResources(this.log, player));
        }
        if (option instanceof DeployOption_1.DeployOption) {
            this.deploy(player, option.worker, option.mech, GameInfo_1.GameInfo.availableResources(this.log, player));
        }
        if (option instanceof EnlistOption_1.EnlistOption) {
            this.enlist(player, option.bottomAction, option.reward, GameInfo_1.GameInfo.availableResources(this.log, player));
        }
        if (option instanceof GainCoinOption_1.GainCoinOption) {
            this.gainCoins(player);
        }
        if (option instanceof MoveOption_1.MoveOption) {
            // @ts-ignore
            this.move(player, ...option.moves);
        }
        if (option instanceof ProduceOption_1.ProduceOption) {
            // @ts-ignore
            this.produce(player, ...option.locations);
        }
        if (option instanceof TradePopularityOption_1.TradePopularityOption) {
            this.tradePopularity(player);
        }
        if (option instanceof TradeResourcesOption_1.TradeResourcesOption) {
            this.tradeResources(player, 
            // @ts-ignore
            GameInfo_1.GameInfo.allWorkers(this.log, player).pop(), option.resource1, option.resource2);
        }
        if (option instanceof UpgradeOption_1.UpgradeOption) {
            this.upgrade(player, option.upgrade.topAction, option.upgrade.bottomAction, GameInfo_1.GameInfo.availableResources(this.log, player));
        }
        if (option instanceof RewardOnlyOption_1.RewardOnlyOption) {
            this.log
                .add(new ActionEvent_1.ActionEvent(player.playerId, option.bottomAction))
                .add(new CoinEvent_1.CoinEvent(player.playerId, player.playerMat.bottomReward(option.bottomAction)));
        }
    }
    move(player, ...moves) {
        const moveEvents = [];
        for (const move of moves) {
            Availability_1.assertActionCanBeTaken(this.log, this.players, player, TopAction_1.TopAction.MOVE);
            Availability_1.assertUnitDeployed(this.log, player, move.unit);
            const currentLocation = GameInfo_1.GameInfo.unitLocation(this.log, player, move.unit);
            GameMap_1.GameMap.assertLegalMove(currentLocation, move.destination, move.unit);
            moveEvents.push(new MoveEvent_1.MoveEvent(player.playerId, move.unit, move.destination));
        }
        this.log.add(new ActionEvent_1.ActionEvent(player.playerId, TopAction_1.TopAction.MOVE));
        moveEvents.forEach((event) => this.log.add(event));
        return this.pass(player, TopAction_1.TopAction.MOVE);
    }
    gainCoins(player) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, TopAction_1.TopAction.MOVE);
        this.log.add(new ActionEvent_1.ActionEvent(player.playerId, TopAction_1.TopAction.MOVE)).add(new CoinEvent_1.CoinEvent(player.playerId, +1));
        return this.pass(player, TopAction_1.TopAction.MOVE);
    }
    bolsterPower(player) {
        const currentPower = GameInfo_1.GameInfo.power(this.log, player);
        const gainedPower = currentPower + 2 > Game.MAX_POWER ? Game.MAX_POWER - currentPower : 2;
        return this.bolster(player, new PowerEvent_1.PowerEvent(player.playerId, gainedPower));
    }
    bolsterCombatCards(player) {
        return this.bolster(player, new GainCombatCardEvent_1.GainCombatCardEvent(player.playerId, new CombatCard_1.CombatCard(2)));
    }
    tradeResources(player, worker, resource1, resource2) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, TopAction_1.TopAction.TRADE);
        Availability_1.assertCoins(this.log, player, 1);
        Availability_1.assertUnitDeployed(this.log, player, worker);
        const workerLocation = GameInfo_1.GameInfo.unitLocation(this.log, player, worker);
        this.log
            .add(new ActionEvent_1.ActionEvent(player.playerId, TopAction_1.TopAction.TRADE))
            .add(new CoinEvent_1.CoinEvent(player.playerId, -1))
            .add(new GainResourceEvent_1.GainResourceEvent(player.playerId, [
            new Resource_1.Resource(workerLocation, resource1),
            new Resource_1.Resource(workerLocation, resource2),
        ]));
        return this.pass(player, TopAction_1.TopAction.TRADE);
    }
    tradePopularity(player) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, TopAction_1.TopAction.TRADE);
        Availability_1.assertCoins(this.log, player, 1);
        Availability_1.assertNotMoreThan20Popularity(this.log, player);
        const gainedPopularity = GameInfo_1.GameInfo.popularity(this.log, player) === Game.MAX_POPULARITY ? 0 : 1;
        this.log
            .add(new ActionEvent_1.ActionEvent(player.playerId, TopAction_1.TopAction.TRADE))
            .add(new CoinEvent_1.CoinEvent(player.playerId, -1))
            .add(new PopularityEvent_1.PopularityEvent(player.playerId, gainedPopularity));
        return this.pass(player, TopAction_1.TopAction.TRADE);
    }
    produce(player, ...fields) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, TopAction_1.TopAction.PRODUCE);
        fields.forEach((field) => Availability_1.assertLocationControlledByPlayer(this.log, player, field));
        const allWorkersCount = GameInfo_1.GameInfo.allWorkers(this.log, player).length;
        if (allWorkersCount >= Game.PRODUCE_POWER_THRESHOLD) {
            Availability_1.assertPower(this.log, player, 1);
        }
        if (allWorkersCount >= Game.PRODUCE_POPULARITY_THRESHOLD) {
            Availability_1.assertPopularity(this.log, player);
        }
        if (allWorkersCount >= Game.PRODUCE_COINS_THRESHOLD) {
            Availability_1.assertCoins(this.log, player);
        }
        this.log.add(new ActionEvent_1.ActionEvent(player.playerId, TopAction_1.TopAction.PRODUCE));
        if (allWorkersCount >= Game.PRODUCE_POWER_THRESHOLD) {
            this.log.add(new PowerEvent_1.PowerEvent(player.playerId, -1));
        }
        if (allWorkersCount >= Game.PRODUCE_POPULARITY_THRESHOLD) {
            this.log.add(new PopularityEvent_1.PopularityEvent(player.playerId, -1));
        }
        if (allWorkersCount >= Game.PRODUCE_COINS_THRESHOLD) {
            this.log.add(new CoinEvent_1.CoinEvent(player.playerId, -1));
        }
        fields.forEach((field) => this.produceOnField(player, field));
        return this.pass(player, TopAction_1.TopAction.PRODUCE);
    }
    build(player, worker, building, resources) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, BottomAction_1.BottomAction.BUILD);
        Availability_1.assertUnitDeployed(this.log, player, worker);
        Availability_1.assertBuildingNotAlreadyBuilt(this.log, player, building);
        const { resourceType, count } = player.playerMat.bottomActionCost(BottomAction_1.BottomAction.BUILD);
        Availability_1.assertAvailableResources(this.log, player, resourceType, count, resources);
        const location = GameInfo_1.GameInfo.unitLocation(this.log, player, worker);
        Availability_1.assertLocationHasNoOtherBuildings(this.log, player, location);
        this.log
            .add(new ActionEvent_1.ActionEvent(player.playerId, BottomAction_1.BottomAction.BUILD))
            .add(new SpendResourceEvent_1.SpendResourceEvent(player.playerId, resources))
            .add(new BuildEvent_1.BuildEvent(player.playerId, location, building))
            .add(new CoinEvent_1.CoinEvent(player.playerId, player.playerMat.bottomReward(BottomAction_1.BottomAction.BUILD)));
        return this.pass(player, BottomAction_1.BottomAction.BUILD);
    }
    pass(player, action) {
        this.handOutStars(player);
        if (action in TopAction_1.TopAction && Availability_1.availableBottomActions(this.log, player).length > 0) {
            return this;
        }
        this.log.add(new PassEvent_1.PassEvent(player.playerId));
        return this;
    }
    deploy(player, worker, mech, resources) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, BottomAction_1.BottomAction.DEPLOY);
        Availability_1.assertAvailableResources(this.log, player, ResourceType_1.ResourceType.METAL, player.playerMat.bottomActionCost(BottomAction_1.BottomAction.DEPLOY).count, resources);
        Availability_1.assertUnitNotDeployed(this.log, player, mech);
        const location = GameInfo_1.GameInfo.unitLocation(this.log, player, worker);
        this.log
            .add(new ActionEvent_1.ActionEvent(player.playerId, BottomAction_1.BottomAction.DEPLOY))
            .add(new DeployEvent_1.DeployEvent(player.playerId, mech, location))
            .add(new CoinEvent_1.CoinEvent(player.playerId, player.playerMat.bottomReward(BottomAction_1.BottomAction.DEPLOY)));
        return this.pass(player, BottomAction_1.BottomAction.DEPLOY);
    }
    enlist(player, bottomAction, recruitReward, resources) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, BottomAction_1.BottomAction.ENLIST);
        Availability_1.assertAvailableResources(this.log, player, ResourceType_1.ResourceType.FOOD, player.playerMat.bottomActionCost(BottomAction_1.BottomAction.ENLIST).count, resources);
        this.log
            .add(new ActionEvent_1.ActionEvent(player.playerId, BottomAction_1.BottomAction.ENLIST))
            .addIfNew(new EnlistEvent_1.EnlistEvent(player.playerId, recruitReward, bottomAction))
            .add(new SpendResourceEvent_1.SpendResourceEvent(player.playerId, resources))
            .add(new CoinEvent_1.CoinEvent(player.playerId, player.playerMat.bottomReward(BottomAction_1.BottomAction.ENLIST)));
        return this.pass(player, BottomAction_1.BottomAction.ENLIST);
    }
    upgrade(player, topAction, bottomAction, resources) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, BottomAction_1.BottomAction.UPGRADE);
        Availability_1.assertAvailableResources(this.log, player, ResourceType_1.ResourceType.OIL, player.playerMat.bottomActionCost(BottomAction_1.BottomAction.UPGRADE).count, resources);
        this.log
            .add(new ActionEvent_1.ActionEvent(player.playerId, BottomAction_1.BottomAction.UPGRADE))
            .add(new UpgradeEvent_1.UpgradeEvent(player.playerId, topAction, bottomAction))
            .add(new CoinEvent_1.CoinEvent(player.playerId, player.playerMat.bottomReward(BottomAction_1.BottomAction.UPGRADE)));
        return this.pass(player, BottomAction_1.BottomAction.UPGRADE);
    }
    bolster(player, event) {
        Availability_1.assertActionCanBeTaken(this.log, this.players, player, TopAction_1.TopAction.BOLSTER);
        Availability_1.assertCoins(this.log, player, 1);
        this.log
            .add(new ActionEvent_1.ActionEvent(player.playerId, TopAction_1.TopAction.BOLSTER))
            .add(event)
            .add(new CoinEvent_1.CoinEvent(player.playerId, -1));
        return this.pass(player, TopAction_1.TopAction.BOLSTER);
    }
    produceOnField(player, location) {
        const workers = GameInfo_1.GameInfo.workersOnLocation(this.log, player, location);
        if (workers === 0) {
            return;
        }
        const allWorkers = GameInfo_1.GameInfo.allWorkers(this.log, player);
        const currentWorkerCount = allWorkers.length;
        if (location.type === FieldType_1.FieldType.VILLAGE && currentWorkerCount !== Game.MAX_WORKERS) {
            const workersToDeploy = workers + currentWorkerCount > Game.MAX_WORKERS ? Game.MAX_WORKERS - currentWorkerCount : workers;
            for (let i = 1; i <= workersToDeploy; i += 1) {
                // @ts-ignore
                const newWorker = Worker_1.Worker[`WORKER_${currentWorkerCount + i}`];
                this.log.add(new DeployEvent_1.DeployEvent(player.playerId, newWorker, location));
            }
            return;
        }
        let typeToProduce = ResourceType_1.ResourceType.METAL;
        switch (location.type) {
            case FieldType_1.FieldType.TUNDRA:
                typeToProduce = ResourceType_1.ResourceType.OIL;
                break;
            case FieldType_1.FieldType.FOREST:
                typeToProduce = ResourceType_1.ResourceType.WOOD;
                break;
            case FieldType_1.FieldType.FARM:
                typeToProduce = ResourceType_1.ResourceType.FOOD;
                break;
            case FieldType_1.FieldType.MOUNTAIN:
                typeToProduce = ResourceType_1.ResourceType.METAL;
                break;
            default:
                return;
        }
        const resources = [];
        for (let i = 0; i < workers; i += 1) {
            resources.push(new Resource_1.Resource(location, typeToProduce));
        }
        this.log.add(new GainResourceEvent_1.GainResourceEvent(player.playerId, resources));
    }
    handOutStars(player) {
        const allStars = Object.keys(Star_1.Star);
        const currentStars = GameInfo_1.GameInfo.stars(this.log, player);
        const missingStars = _.difference(allStars, currentStars);
        let starCount = currentStars.length;
        for (const star of missingStars) {
            if (GameInfo_1.GameInfo.starCondition(this.log, player, star)) {
                this.log.add(new StarEvent_1.StarEvent(player.playerId, star));
                starCount += 1;
            }
            if (starCount === 6) {
                this.log.add(new GameEndEvent_1.GameEndEvent(player.playerId));
                break;
            }
        }
    }
}
Game.PRODUCE_POWER_THRESHOLD = 4;
Game.PRODUCE_POPULARITY_THRESHOLD = 6;
Game.PRODUCE_COINS_THRESHOLD = 8;
Game.MAX_POWER = 16;
Game.MAX_POPULARITY = 18;
Game.MAX_WORKERS = 8;
Game.MAX_PLAYERS = 7;
exports.Game = Game;

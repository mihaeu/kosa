"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("ramda");
const BottomAction_1 = require("./BottomAction");
const BuildingAlreadyBuiltError_1 = require("./BuildingAlreadyBuiltError");
const BuildingType_1 = require("./BuildingType");
const CannotHaveMoreThan20PopularityError_1 = require("./CannotHaveMoreThan20PopularityError");
const BuildEvent_1 = require("./Events/BuildEvent");
const DeployEvent_1 = require("./Events/DeployEvent");
const FieldType_1 = require("./FieldType");
const Game_1 = require("./Game");
const GameInfo_1 = require("./GameInfo");
const GameMap_1 = require("./GameMap");
const IllegalActionError_1 = require("./IllegalActionError");
const LocationAlreadyHasAnotherBuildingError_1 = require("./LocationAlreadyHasAnotherBuildingError");
const LocationNotInTerritoryError_1 = require("./LocationNotInTerritoryError");
const Move_1 = require("./Move");
const NotEnoughCoinsError_1 = require("./NotEnoughCoinsError");
const NotEnoughPopularityError_1 = require("./NotEnoughPopularityError");
const NotEnoughPowerError_1 = require("./NotEnoughPowerError");
const NotEnoughResourcesError_1 = require("./NotEnoughResourcesError");
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
const ProvidedResourcesNotAvailableError_1 = require("./ProvidedResourcesNotAvailableError");
const RecruitReward_1 = require("./RecruitReward");
const ResourceType_1 = require("./ResourceType");
const TopAction_1 = require("./TopAction");
const UnitAlreadyDeployedError_1 = require("./UnitAlreadyDeployedError");
const UnitNotDeployedError_1 = require("./UnitNotDeployedError");
const Mech_1 = require("./Units/Mech");
const Worker_1 = require("./Units/Worker");
const Upgrade_1 = require("./Upgrade");
function isTopActionAvailable(log, players, player) {
    return (topAction) => {
        try {
            assertActionCanBeTaken(log, players, player, topAction);
            assertCoins(log, player, player.playerMat.topActionCost(topAction));
            // @TODO super hacky, extract
            if (topAction === TopAction_1.TopAction.PRODUCE) {
                const workerCount = GameInfo_1.GameInfo.allWorkers(log, player).length;
                if (workerCount >= Game_1.Game.PRODUCE_POWER_THRESHOLD) {
                    assertPower(log, player);
                }
                if (workerCount >= Game_1.Game.PRODUCE_POPULARITY_THRESHOLD) {
                    assertPopularity(log, player);
                }
                if (workerCount >= Game_1.Game.PRODUCE_COINS_THRESHOLD) {
                    assertCoins(log, player);
                }
            }
            return true;
        }
        catch (error) {
            return false;
        }
    };
}
function availableTopActions(log, players, player) {
    return _.filter(isTopActionAvailable(log, players, player), Object.keys(TopAction_1.TopAction));
}
exports.availableTopActions = availableTopActions;
function isBottomActionAvailable(log, players, player) {
    return (bottomAction) => {
        try {
            assertActionCanBeTaken(log, players, player, bottomAction);
            const { resourceType, count } = player.playerMat.bottomActionCost(bottomAction);
            return GameInfo_1.GameInfo.resources(log, player).countByType(resourceType) >= count;
        }
        catch (error) {
            return false;
        }
    };
}
function availableBottomActions(log, players, player) {
    return _.filter(isBottomActionAvailable(log, players, player), Object.keys(BottomAction_1.BottomAction));
}
exports.availableBottomActions = availableBottomActions;
function availableOptionsForAction(action, log, player) {
    switch (action) {
        case TopAction_1.TopAction.TRADE:
            return availableTradeOptions(log, player);
        case TopAction_1.TopAction.BOLSTER:
            return availableBolsterOptions(log, player);
        case TopAction_1.TopAction.PRODUCE:
            return availableProduceOptions(log, player);
        case TopAction_1.TopAction.MOVE:
            return availableMoveOptions(log, player);
        case BottomAction_1.BottomAction.ENLIST:
            return availableEnlistOptions(log, player);
        case BottomAction_1.BottomAction.UPGRADE:
            return availableUpgradeOptions(log, player);
        case BottomAction_1.BottomAction.DEPLOY:
            return availableDeployOptions(log, player);
        case BottomAction_1.BottomAction.BUILD:
            return availableBuildOptions(log, player);
        default:
            return [];
    }
}
exports.availableOptionsForAction = availableOptionsForAction;
function getCombinations(array, size, start, initialStuff, output) {
    if (initialStuff.length >= size) {
        output.push(initialStuff);
    }
    else {
        for (let i = start; i < array.length; ++i) {
            getCombinations(array, size, i + 1, initialStuff.concat(array[i]), output);
        }
    }
}
function getAllPossibleCombinations(array, size, output) {
    getCombinations(array, size, 0, [], output);
}
function availableBolsterOptions(log, player) {
    if (!isTopActionAvailable(log, GameInfo_1.GameInfo.players(log), player)(TopAction_1.TopAction.BOLSTER)) {
        return [];
    }
    return [new BolsterPowerOption_1.BolsterPowerOption(), new BolsterCombatCardsOption_1.BolsterCombatCardsOption()];
}
exports.availableBolsterOptions = availableBolsterOptions;
function availableTradeOptions(log, player) {
    if (!isTopActionAvailable(log, GameInfo_1.GameInfo.players(log), player)(TopAction_1.TopAction.TRADE)) {
        return [];
    }
    let resourceCombinations = [];
    const resources = Object.keys(ResourceType_1.ResourceType).concat(Object.keys(ResourceType_1.ResourceType));
    getAllPossibleCombinations(resources, 2, resourceCombinations);
    resourceCombinations = _.map(
    // @ts-ignore
    (resourceTypes) => new TradeResourcesOption_1.TradeResourcesOption(resourceTypes.pop(), resourceTypes.pop()), _.uniq(resourceCombinations));
    return [new TradePopularityOption_1.TradePopularityOption()].concat(resourceCombinations);
}
exports.availableTradeOptions = availableTradeOptions;
function fieldsWithWorkers(log, player) {
    const fields = [];
    for (const [unit, field] of GameInfo_1.GameInfo.units(log, player)) {
        if (_.contains(field, fields) ||
            !(unit instanceof Worker_1.Worker) ||
            field.type === FieldType_1.FieldType.HOMEBASE ||
            field.type === FieldType_1.FieldType.LAKE) {
            continue;
        }
        fields.push(field);
    }
    return fields;
}
function availableProduceOptions(log, player) {
    if (!isTopActionAvailable(log, GameInfo_1.GameInfo.players(log), player)(TopAction_1.TopAction.PRODUCE)) {
        return [];
    }
    const fields = fieldsWithWorkers(log, player);
    const fieldCombinations = [];
    getAllPossibleCombinations(fields, 2, fieldCombinations);
    if (fieldCombinations.length === 0) {
        fieldCombinations.push(fields);
    }
    return _.map((locations) => new ProduceOption_1.ProduceOption(locations), _.uniq(fieldCombinations));
}
exports.availableProduceOptions = availableProduceOptions;
function availableMoveOptions(log, player) {
    if (!isTopActionAvailable(log, GameInfo_1.GameInfo.players(log), player)(TopAction_1.TopAction.MOVE)) {
        return [];
    }
    const moveOptions = [];
    for (const [unit, location] of GameInfo_1.GameInfo.units(log, player).entries()) {
        _.forEach((destination) => moveOptions.push(new Move_1.Move(unit, destination)), GameMap_1.GameMap.options(location));
    }
    const moveCombinations = [];
    getAllPossibleCombinations(moveOptions, 2, moveCombinations);
    return [new GainCoinOption_1.GainCoinOption()]
        .concat(_.map((move) => new MoveOption_1.MoveOption([move]), moveOptions))
        .concat(_.map((moves) => new MoveOption_1.MoveOption(moves), moveCombinations));
}
exports.availableMoveOptions = availableMoveOptions;
function availableBuildOptions(log, player) {
    if (!isBottomActionAvailable(log, GameInfo_1.GameInfo.players(log), player)(BottomAction_1.BottomAction.BUILD)) {
        return [];
    }
    const blockedBuildingTypes = [];
    const blockedFields = [];
    for (const building of GameInfo_1.GameInfo.buildings(log, player)) {
        blockedBuildingTypes.push(building.building);
        blockedFields.push(building.location);
    }
    const availableWorkers = new Map();
    for (const [unit, location] of GameInfo_1.GameInfo.units(log, player)) {
        if (unit instanceof Worker_1.Worker && !_.contains(location, blockedFields)) {
            availableWorkers.set(location, unit);
        }
    }
    const allBuildingTypes = Object.keys(BuildingType_1.BuildingType);
    const buildOptions = [new RewardOnlyOption_1.RewardOnlyOption(BottomAction_1.BottomAction.BUILD)];
    for (const worker of availableWorkers.values()) {
        for (const buildingType of _.difference(allBuildingTypes, blockedBuildingTypes)) {
            buildOptions.push(new BuildOption_1.BuildOption(worker, buildingType));
        }
    }
    return buildOptions;
}
exports.availableBuildOptions = availableBuildOptions;
function availableDeployOptions(log, player) {
    if (!isBottomActionAvailable(log, GameInfo_1.GameInfo.players(log), player)(BottomAction_1.BottomAction.DEPLOY)) {
        return [];
    }
    const allMechs = [Mech_1.Mech.MECH_1, Mech_1.Mech.MECH_2, Mech_1.Mech.MECH_3, Mech_1.Mech.MECH_4];
    const blockedMechs = [];
    for (const unit of GameInfo_1.GameInfo.units(log, player).keys()) {
        if (unit instanceof Mech_1.Mech) {
            blockedMechs.push(unit);
        }
    }
    const availableWorkers = new Map();
    for (const [unit, location] of GameInfo_1.GameInfo.units(log, player)) {
        if (unit instanceof Worker_1.Worker) {
            availableWorkers.set(location, unit);
        }
    }
    const deployOptions = [new RewardOnlyOption_1.RewardOnlyOption(BottomAction_1.BottomAction.DEPLOY)];
    for (const mech of _.difference(allMechs, blockedMechs)) {
        for (const worker of availableWorkers.values()) {
            deployOptions.push(new DeployOption_1.DeployOption(worker, mech));
        }
    }
    return deployOptions;
}
exports.availableDeployOptions = availableDeployOptions;
function availableEnlistOptions(log, player) {
    if (!isBottomActionAvailable(log, GameInfo_1.GameInfo.players(log), player)(BottomAction_1.BottomAction.ENLIST)) {
        return [];
    }
    const recruits = GameInfo_1.GameInfo.recruits(log, player);
    const options = [new RewardOnlyOption_1.RewardOnlyOption(BottomAction_1.BottomAction.ENLIST)];
    for (let i = recruits.length; i < 4; i += 1) {
        options.push(new EnlistOption_1.EnlistOption(RecruitReward_1.RecruitReward.COINS, BottomAction_1.BottomAction.ENLIST));
    }
    return options;
}
exports.availableEnlistOptions = availableEnlistOptions;
function availableUpgradeOptions(log, player) {
    if (!isBottomActionAvailable(log, GameInfo_1.GameInfo.players(log), player)(BottomAction_1.BottomAction.UPGRADE)) {
        return [];
    }
    const upgrades = GameInfo_1.GameInfo.upgrades(log, player);
    const options = [new RewardOnlyOption_1.RewardOnlyOption(BottomAction_1.BottomAction.UPGRADE)];
    for (let i = upgrades.length; i < 6; i += 1) {
        options.push(new UpgradeOption_1.UpgradeOption(new Upgrade_1.Upgrade(TopAction_1.TopAction.TRADE, BottomAction_1.BottomAction.UPGRADE)));
    }
    return options;
}
exports.availableUpgradeOptions = availableUpgradeOptions;
function assertLocationControlledByPlayer(log, player, location) {
    const territory = GameInfo_1.GameInfo.territories(log, player);
    if (!_.contains(location, territory)) {
        throw new LocationNotInTerritoryError_1.LocationNotInTerritoryError(location, territory);
    }
}
exports.assertLocationControlledByPlayer = assertLocationControlledByPlayer;
function assertAvailableResources(log, player, type, required, resources) {
    const availableResourcesCount = GameInfo_1.GameInfo.resources(log, player).countByType(type);
    if (availableResourcesCount < required) {
        throw new NotEnoughResourcesError_1.NotEnoughResourcesError(type, required, availableResourcesCount);
    }
    const availableResources = GameInfo_1.GameInfo.availableResources(log, player);
    if (resources.some((resource) => !_.contains(resource, availableResources))) {
        throw new ProvidedResourcesNotAvailableError_1.ProvidedResourcesNotAvailableError(resources, availableResources);
    }
}
exports.assertAvailableResources = assertAvailableResources;
function assertCoins(log, player, required = 1) {
    const coins = GameInfo_1.GameInfo.coins(log, player);
    if (coins < required) {
        throw new NotEnoughCoinsError_1.NotEnoughCoinsError(1, coins);
    }
}
exports.assertCoins = assertCoins;
function assertPopularity(log, player, required = 1) {
    const popularity = GameInfo_1.GameInfo.popularity(log, player);
    if (popularity < required) {
        throw new NotEnoughPopularityError_1.NotEnoughPopularityError(1, popularity);
    }
}
exports.assertPopularity = assertPopularity;
function assertPower(log, player, required = 1) {
    const power = GameInfo_1.GameInfo.power(log, player);
    if (power < required) {
        throw new NotEnoughPowerError_1.NotEnoughPowerError(1, power);
    }
}
exports.assertPower = assertPower;
function assertUnitDeployed(log, player, unit) {
    if (_.none((event) => event.unit === unit, log.filterBy(player.playerId, DeployEvent_1.DeployEvent))) {
        throw new UnitNotDeployedError_1.UnitNotDeployedError(unit);
    }
}
exports.assertUnitDeployed = assertUnitDeployed;
function assertUnitNotDeployed(log, player, unit) {
    if (_.any((event) => event.unit === unit, log.filterBy(player.playerId, DeployEvent_1.DeployEvent))) {
        throw new UnitAlreadyDeployedError_1.UnitAlreadyDeployedError(unit);
    }
}
exports.assertUnitNotDeployed = assertUnitNotDeployed;
function assertBuildingNotAlreadyBuilt(log, player, building) {
    if (!_.none((event) => building === event.building, log.filterBy(player.playerId, BuildEvent_1.BuildEvent))) {
        throw new BuildingAlreadyBuiltError_1.BuildingAlreadyBuildError(building);
    }
}
exports.assertBuildingNotAlreadyBuilt = assertBuildingNotAlreadyBuilt;
function assertLocationHasNoOtherBuildings(log, player, location) {
    if (!_.none((event) => location === event.location, log.filterBy(player.playerId, BuildEvent_1.BuildEvent))) {
        throw new LocationAlreadyHasAnotherBuildingError_1.LocationAlreadyHasAnotherBuildingError(location);
    }
}
exports.assertLocationHasNoOtherBuildings = assertLocationHasNoOtherBuildings;
function assertActionCanBeTaken(log, players, player, currentAction) {
    if (GameInfo_1.GameInfo.gameJustStarted(log) && !GameInfo_1.GameInfo.playerIsFirstPlayer(players, player)) {
        throw new IllegalActionError_1.IllegalActionError("You are not the starting player.");
    }
    const lastAction = GameInfo_1.GameInfo.lastActionFor(log, player);
    if (lastAction === null) {
        return;
    }
    if (!GameInfo_1.GameInfo.playerIsNext(log, players, player, currentAction)) {
        throw new IllegalActionError_1.IllegalActionError("It is not your turn yet.");
    }
    if (lastAction === currentAction ||
        (GameInfo_1.GameInfo.isFirstActionThisTurn(log, player) &&
            GameInfo_1.GameInfo.actionFromTheSameColumn(lastAction, currentAction, player))) {
        throw new IllegalActionError_1.IllegalActionError("Cannot use actions from the same column.");
    }
    if (!GameInfo_1.GameInfo.isFirstActionThisTurn(log, player) &&
        currentAction in BottomAction_1.BottomAction &&
        lastAction in TopAction_1.TopAction &&
        GameInfo_1.GameInfo.lastPlayer(log, players) === player &&
        !player.playerMat.topActionMatchesBottomAction(lastAction, currentAction)) {
        throw new IllegalActionError_1.IllegalActionError("Cannot use this bottom action with the last top action.");
    }
}
exports.assertActionCanBeTaken = assertActionCanBeTaken;
function assertNotMoreThan20Popularity(log, player) {
    if (GameInfo_1.GameInfo.popularity(log, player) > 20) {
        throw new CannotHaveMoreThan20PopularityError_1.CannotHaveMoreThan20PopularityError();
    }
}
exports.assertNotMoreThan20Popularity = assertNotMoreThan20Popularity;

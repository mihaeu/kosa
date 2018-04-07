import * as _ from "ramda";
import { BottomAction } from "./BottomAction";
import { BuildingAlreadyBuildError } from "./BuildingAlreadyBuiltError";
import { BuildingType } from "./BuildingType";
import { CannotHaveMoreThan20PopularityError } from "./CannotHaveMoreThan20PopularityError";
import { BuildEvent } from "./Events/BuildEvent";
import { DeployEvent } from "./Events/DeployEvent";
import { EventLog } from "./Events/EventLog";
import { Field } from "./Field";
import { FieldType } from "./FieldType";
import { Game } from "./Game";
import { GameInfo } from "./GameInfo";
import { GameMap } from "./GameMap";
import { IllegalActionError } from "./IllegalActionError";
import { LocationAlreadyHasAnotherBuildingError } from "./LocationAlreadyHasAnotherBuildingError";
import { LocationNotInTerritoryError } from "./LocationNotInTerritoryError";
import { Move } from "./Move";
import { NotEnoughCoinsError } from "./NotEnoughCoinsError";
import { NotEnoughPopularityError } from "./NotEnoughPopularityError";
import { NotEnoughPowerError } from "./NotEnoughPowerError";
import { NotEnoughResourcesError } from "./NotEnoughResourcesError";
import { BolsterCombatCardsOption } from "./Options/BolsterCombatCardsOption";
import { BolsterPowerOption } from "./Options/BolsterPowerOption";
import { BuildOption } from "./Options/BuildOption";
import { DeployOption } from "./Options/DeployOption";
import { EnlistOption } from "./Options/EnlistOption";
import { GainCoinOption } from "./Options/GainCoinOption";
import { MoveOption } from "./Options/MoveOption";
import { Option } from "./Options/Option";
import { ProduceOption } from "./Options/ProduceOption";
import { RewardOnlyOption } from "./Options/RewardOnlyOption";
import { TradePopularityOption } from "./Options/TradePopularityOption";
import { TradeResourcesOption } from "./Options/TradeResourcesOption";
import { UpgradeOption } from "./Options/UpgradeOption";
import { Player } from "./Player";
import { ProvidedResourcesNotAvailableError } from "./ProvidedResourcesNotAvailableError";
import { Recruit } from "./Recruit";
import { RecruitReward } from "./RecruitReward";
import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { TopAction } from "./TopAction";
import { UnitAlreadyDeployedError } from "./UnitAlreadyDeployedError";
import { UnitNotDeployedError } from "./UnitNotDeployedError";
import { Mech } from "./Units/Mech";
import { Unit } from "./Units/Unit";
import { Worker } from "./Units/Worker";
import { Upgrade } from "./Upgrade";

function isTopActionAvailable(log: EventLog, players: Player[], player: Player) {
    return (topAction: TopAction): boolean => {
        try {
            assertActionCanBeTaken(log, players, player, topAction);
            assertTopActionCosts(log, player, topAction);
            return true;
        } catch (error) {
            return false;
        }
    };
}

function assertTopActionCosts(log: EventLog, player: Player, topAction: TopAction): void {
    topAction === TopAction.PRODUCE
        ? assertProduceCosts(log, player)
        : assertCoins(log, player, player.playerMat.topActionCost(topAction));
}

function assertProduceCosts(log: EventLog, player: Player): void {
    const workerCount = GameInfo.allWorkers(log, player).length;
    if (workerCount >= Game.PRODUCE_POWER_THRESHOLD) {
        assertPower(log, player);
    }
    if (workerCount >= Game.PRODUCE_POPULARITY_THRESHOLD) {
        assertPopularity(log, player);
    }

    if (workerCount >= Game.PRODUCE_COINS_THRESHOLD) {
        assertCoins(log, player);
    }
}

export function availableTopActions(log: EventLog, player: Player): TopAction[] {
    return _.filter(isTopActionAvailable(log, GameInfo.players(log), player), Object.keys(TopAction) as TopAction[]);
}

function isBottomActionAvailable(log: EventLog, players: Player[], player: Player) {
    return (bottomAction: BottomAction): boolean => {
        try {
            assertActionCanBeTaken(log, players, player, bottomAction);
            const { resourceType, count } = player.playerMat.bottomActionCost(bottomAction);
            return GameInfo.resources(log, player).countByType(resourceType) >= count;
        } catch (error) {
            return false;
        }
    };
}

export function availableBottomActions(log: EventLog, player: Player): BottomAction[] {
    return _.filter(isBottomActionAvailable(log, GameInfo.players(log), player), Object.keys(
        BottomAction,
    ) as BottomAction[]);
}

export function availableOptionsForAction(action: TopAction | BottomAction, log: EventLog, player: Player): Option[] {
    switch (action) {
        case TopAction.TRADE:
            return availableTradeOptions(log, player);
        case TopAction.BOLSTER:
            return availableBolsterOptions(log, player);
        case TopAction.PRODUCE:
            return availableProduceOptions(log, player);
        case TopAction.MOVE:
            return availableMoveOptions(log, player);
        case BottomAction.ENLIST:
            return availableEnlistOptions(log, player);
        case BottomAction.UPGRADE:
            return availableUpgradeOptions(log, player);
        case BottomAction.DEPLOY:
            return availableDeployOptions(log, player);
        case BottomAction.BUILD:
            return availableBuildOptions(log, player);
        default:
            return [];
    }
}

function getCombinations<T>(array: T[], size: number, start: number, initialStuff: T[], output: T[][]) {
    if (initialStuff.length >= size) {
        output.push(initialStuff);
    } else {
        for (let i = start; i < array.length; ++i) {
            getCombinations(array, size, i + 1, initialStuff.concat(array[i]), output);
        }
    }
}

function getAllPossibleCombinations<T>(array: T[], size: number, output: T[][]) {
    getCombinations(array, size, 0, [], output);
}
export function availableBolsterOptions(log: EventLog, player: Player): Option[] {
    if (!isTopActionAvailable(log, GameInfo.players(log), player)(TopAction.BOLSTER)) {
        return [];
    }
    return [new BolsterPowerOption(), new BolsterCombatCardsOption()];
}

export function availableTradeOptions(log: EventLog, player: Player): Option[] {
    if (!isTopActionAvailable(log, GameInfo.players(log), player)(TopAction.TRADE)) {
        return [];
    }
    const resourceCombinations: ResourceType[][] = [];
    const resources = Object.keys(ResourceType).concat(Object.keys(ResourceType)) as ResourceType[];
    getAllPossibleCombinations(resources, 2, resourceCombinations);
    const options = _.map(
        // @ts-ignore
        (resourceTypes: ResourceType[]) => new TradeResourcesOption(resourceTypes.pop(), resourceTypes.pop()),
        _.uniq(resourceCombinations),
    );
    return [new TradePopularityOption()].concat(options);
}

function fieldsWithWorkers(log: EventLog, player: Player): Field[] {
    const fields: Field[] = [];
    for (const [unit, field] of GameInfo.units(log, player)) {
        if (
            _.contains(field, fields) ||
            !(unit instanceof Worker) ||
            field.type === FieldType.HOMEBASE ||
            field.type === FieldType.LAKE
        ) {
            continue;
        }
        fields.push(field);
    }
    return fields;
}

export function availableProduceOptions(log: EventLog, player: Player): Option[] {
    if (!isTopActionAvailable(log, GameInfo.players(log), player)(TopAction.PRODUCE)) {
        return [];
    }
    const fields: Field[] = fieldsWithWorkers(log, player);

    const fieldCombinations: Field[][] = [];
    getAllPossibleCombinations(fields, 2, fieldCombinations);
    if (fieldCombinations.length === 0) {
        fieldCombinations.push(fields);
    }

    return _.map((locations: Field[]) => new ProduceOption(locations), _.uniq(fieldCombinations));
}

export function availableMoveOptions(log: EventLog, player: Player): Option[] {
    if (!isTopActionAvailable(log, GameInfo.players(log), player)(TopAction.MOVE)) {
        return [];
    }

    const moveOptions: Move[] = [];
    for (const [unit, location] of GameInfo.units(log, player).entries()) {
        _.forEach((destination: Field) => moveOptions.push(new Move(unit, destination)), GameMap.options(location));
    }

    const moveCombinations: Move[][] = [];
    getAllPossibleCombinations(moveOptions, 2, moveCombinations);
    return [new GainCoinOption()]
        .concat(_.map((move: Move) => new MoveOption([move]), moveOptions))
        .concat(_.map((moves: Move[]) => new MoveOption(moves), moveCombinations));
}

export function availableBuildOptions(log: EventLog, player: Player): Option[] {
    if (!isBottomActionAvailable(log, GameInfo.players(log), player)(BottomAction.BUILD)) {
        return [];
    }

    const blockedBuildingTypes: BuildingType[] = [];
    const blockedFields: Field[] = [];
    for (const building of GameInfo.buildings(log, player)) {
        blockedBuildingTypes.push(building.building);
        blockedFields.push(building.location);
    }

    const availableWorkers: Map<Field, Worker> = new Map();
    for (const [unit, location] of GameInfo.units(log, player)) {
        if (unit instanceof Worker && !_.contains(location, blockedFields)) {
            availableWorkers.set(location, unit);
        }
    }

    const allBuildingTypes: BuildingType[] = Object.keys(BuildingType) as BuildingType[];
    const buildOptions: Option[] = [new RewardOnlyOption(BottomAction.BUILD)];
    for (const worker of availableWorkers.values()) {
        for (const buildingType of _.difference(allBuildingTypes, blockedBuildingTypes)) {
            buildOptions.push(new BuildOption(worker, buildingType));
        }
    }
    return buildOptions;
}

export function availableDeployOptions(log: EventLog, player: Player): Option[] {
    if (!isBottomActionAvailable(log, GameInfo.players(log), player)(BottomAction.DEPLOY)) {
        return [];
    }

    const allMechs = [Mech.MECH_1, Mech.MECH_2, Mech.MECH_3, Mech.MECH_4];
    const blockedMechs: Mech[] = [];
    for (const unit of GameInfo.units(log, player).keys()) {
        if (unit instanceof Mech) {
            blockedMechs.push(unit);
        }
    }

    const availableWorkers: Map<Field, Worker> = new Map();
    for (const [unit, location] of GameInfo.units(log, player)) {
        if (unit instanceof Worker) {
            availableWorkers.set(location, unit);
        }
    }

    const deployOptions: Option[] = [new RewardOnlyOption(BottomAction.DEPLOY)];
    for (const mech of _.difference(allMechs, blockedMechs)) {
        for (const worker of availableWorkers.values()) {
            deployOptions.push(new DeployOption(worker, mech));
        }
    }
    return deployOptions;
}

export function availableEnlistOptions(log: EventLog, player: Player): Option[] {
    if (!isBottomActionAvailable(log, GameInfo.players(log), player)(BottomAction.ENLIST)) {
        return [];
    }

    const recruits: Recruit[] = GameInfo.recruits(log, player);
    const options: Option[] = [new RewardOnlyOption(BottomAction.ENLIST)];
    for (let i = recruits.length; i < 4; i += 1) {
        options.push(new EnlistOption(RecruitReward.COINS, BottomAction.ENLIST));
    }
    return options;
}

export function availableUpgradeOptions(log: EventLog, player: Player): Option[] {
    if (!isBottomActionAvailable(log, GameInfo.players(log), player)(BottomAction.UPGRADE)) {
        return [];
    }

    const upgrades: Upgrade[] = GameInfo.upgrades(log, player);
    const options: Option[] = [new RewardOnlyOption(BottomAction.UPGRADE)];
    for (let i = upgrades.length; i < 6; i += 1) {
        options.push(new UpgradeOption(new Upgrade(TopAction.TRADE, BottomAction.UPGRADE)));
    }
    return options;
}

export function assertLocationControlledByPlayer(log: EventLog, player: Player, location: Field) {
    const territory = GameInfo.territories(log, player);
    if (!_.contains(location, territory)) {
        throw new LocationNotInTerritoryError(location, territory);
    }
}

export function assertAvailableResources(
    log: EventLog,
    player: Player,
    type: ResourceType,
    required: number,
    resources: Resource[],
) {
    const availableResourcesCount = GameInfo.resources(log, player).countByType(type);
    if (availableResourcesCount < required) {
        throw new NotEnoughResourcesError(type, required, availableResourcesCount);
    }

    const availableResources = GameInfo.availableResources(log, player);
    if (resources.some((resource) => !_.contains(resource, availableResources))) {
        throw new ProvidedResourcesNotAvailableError(resources, availableResources);
    }
}

export function assertCoins(log: EventLog, player: Player, required: number = 1): void {
    const coins = GameInfo.coins(log, player);
    if (coins < required) {
        throw new NotEnoughCoinsError(1, coins);
    }
}

export function assertPopularity(log: EventLog, player: Player, required: number = 1): void {
    const popularity = GameInfo.popularity(log, player);
    if (popularity < required) {
        throw new NotEnoughPopularityError(1, popularity);
    }
}

export function assertPower(log: EventLog, player: Player, required: number = 1): void {
    const power = GameInfo.power(log, player);
    if (power < required) {
        throw new NotEnoughPowerError(1, power);
    }
}

export function assertUnitDeployed(log: EventLog, player: Player, unit: Unit): void {
    if (
        _.none((event: DeployEvent) => event.unit === unit, log.filterBy(player.playerId, DeployEvent) as DeployEvent[])
    ) {
        throw new UnitNotDeployedError(unit);
    }
}

export function assertUnitNotDeployed(log: EventLog, player: Player, unit: Unit): void {
    if (
        _.any((event: DeployEvent) => event.unit === unit, log.filterBy(player.playerId, DeployEvent) as DeployEvent[])
    ) {
        throw new UnitAlreadyDeployedError(unit);
    }
}

export function assertBuildingNotAlreadyBuilt(log: EventLog, player: Player, building: BuildingType): void {
    if (
        !_.none((event: BuildEvent) => building === event.building, log.filterBy(
            player.playerId,
            BuildEvent,
        ) as BuildEvent[])
    ) {
        throw new BuildingAlreadyBuildError(building);
    }
}

export function assertLocationHasNoOtherBuildings(log: EventLog, player: Player, location: Field): void {
    if (
        !_.none((event: BuildEvent) => location === event.location, log.filterBy(
            player.playerId,
            BuildEvent,
        ) as BuildEvent[])
    ) {
        throw new LocationAlreadyHasAnotherBuildingError(location);
    }
}

export function assertActionCanBeTaken(
    log: EventLog,
    players: Player[],
    player: Player,
    currentAction: TopAction | BottomAction,
): void {
    if (GameInfo.gameJustStarted(log) && !GameInfo.playerIsFirstPlayer(players, player)) {
        throw new IllegalActionError("You are not the starting player.");
    }

    const lastAction = GameInfo.lastActionFor(log, player);
    if (lastAction === null) {
        return;
    }

    if (!GameInfo.playerIsNext(log, players, player, currentAction)) {
        throw new IllegalActionError("It is not your turn yet.");
    }

    if (
        lastAction === currentAction ||
        (GameInfo.isFirstActionThisTurn(log, player) &&
            GameInfo.actionFromTheSameColumn(lastAction, currentAction, player))
    ) {
        throw new IllegalActionError("Cannot use actions from the same column.");
    }

    if (
        !GameInfo.isFirstActionThisTurn(log, player) &&
        currentAction in BottomAction &&
        lastAction in TopAction &&
        GameInfo.lastPlayer(log, players) === player &&
        !player.playerMat.topActionMatchesBottomAction(lastAction, currentAction)
    ) {
        throw new IllegalActionError("Cannot use this bottom action with the last top action.");
    }
}

export function assertNotMoreThan20Popularity(log: EventLog, player: Player) {
    if (GameInfo.popularity(log, player) > 20) {
        throw new CannotHaveMoreThan20PopularityError();
    }
}

import * as _ from "ramda";
import { BottomAction } from "./BottomAction";
import { BuildingAlreadyBuildError } from "./BuildingAlreadyBuiltError";
import { BuildingType } from "./BuildingType";
import { CannotHaveMoreThan20PopularityError } from "./CannotHaveMoreThan20PopularityError";
import { BuildEvent } from "./Events/BuildEvent";
import { DeployEvent } from "./Events/DeployEvent";
import { EventLog } from "./Events/EventLog";
import { Field } from "./Field";
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
import { GainCoinOption } from "./Options/GainCoinOption";
import { MoveOption } from "./Options/MoveOption";
import { Option } from "./Options/Option";
import { ProduceOption } from "./Options/ProduceOption";
import { TradePopularityOption } from "./Options/TradePopularityOption";
import { TradeResourcesOption } from "./Options/TradeResourcesOption";
import { Player } from "./Player";
import { ProvidedResourcesNotAvailableError } from "./ProvidedResourcesNotAvailableError";
import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { TopAction } from "./TopAction";
import { UnitAlreadyDeployedError } from "./UnitAlreadyDeployedError";
import { UnitNotDeployedError } from "./UnitNotDeployedError";
import { Unit } from "./Units/Unit";
import { Worker } from "./Units/Worker";

function isTopActionAvailable(log: EventLog, players: Player[], player: Player) {
    return (topAction: TopAction): boolean => {
        try {
            assertActionCanBeTaken(log, players, player, topAction);
            assertCoins(log, player, player.playerMat.topActionCost(topAction));
            return true;
        } catch (error) {
            return false;
        }
    };
}

export function availableTopActions(log: EventLog, players: Player[], player: Player): TopAction[] {
    return _.filter(isTopActionAvailable(log, players, player), Object.keys(TopAction) as TopAction[]);
}

export function availableBottomActions(log: EventLog, players: Player[], player: Player): BottomAction[] {
    return _.filter(
        (bottomAction: BottomAction): boolean => {
            try {
                assertActionCanBeTaken(log, players, player, bottomAction);
                const { resourceType, count } = player.playerMat.bottomActionCost(bottomAction);
                return GameInfo.resources(log, player).countByType(resourceType) >= count;
            } catch (error) {
                return false;
            }
        },
        Object.keys(BottomAction) as BottomAction[],
    );
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
    let resourceCombinations: ResourceType[][] = [];
    const resources = Object.keys(ResourceType).concat(Object.keys(ResourceType)) as ResourceType[];
    getAllPossibleCombinations(resources, 2, resourceCombinations);
    resourceCombinations = _.map(
        (resourceTypes: ResourceType[]) => new TradeResourcesOption(resourceTypes.pop(), resourceTypes.pop()),
        _.uniq(resourceCombinations),
    );
    return [new TradePopularityOption()].concat(resourceCombinations);
}

export function availableProduceOptions(log: EventLog, player: Player): Option[] {
    if (!isTopActionAvailable(log, GameInfo.players(log), player)(TopAction.PRODUCE)) {
        return [];
    }
    const fieldsWithWorkers: Field[] = [];
    for (const [unit, field] of GameInfo.units(log, player)) {
        if (_.contains(field, fieldsWithWorkers) || !(unit instanceof Worker)) {
            continue;
        }
        fieldsWithWorkers.push(field);
    }

    const fieldCombinations: Field[][] = [];
    getAllPossibleCombinations(fieldsWithWorkers, 2, fieldCombinations);
    if (fieldCombinations.length === 0) {
        fieldCombinations.push(fieldsWithWorkers);
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
    return [new GainCoinOption()].concat(_.map((moves: Move[]) => new MoveOption(moves), moveCombinations));
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

export function assertCoins(log: EventLog, player: Player, required: number): void {
    const coins = GameInfo.coins(log, player);
    if (coins < required) {
        throw new NotEnoughCoinsError(1, coins);
    }
}

export function assertPopularity(log: EventLog, player: Player, required: number): void {
    const popularity = GameInfo.popularity(log, player);
    if (popularity < required) {
        throw new NotEnoughPopularityError(1, popularity);
    }
}

export function assertPower(log: EventLog, player: Player, required: number): void {
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
    if (!_.none((event) => building === (event as BuildEvent).building, log.filterBy(player.playerId, BuildEvent))) {
        throw new BuildingAlreadyBuildError(building);
    }
}

export function assertLocationHasNoOtherBuildings(log: EventLog, player: Player, location: Field): void {
    if (!_.none((event) => location === (event as BuildEvent).location, log.filterBy(player.playerId, BuildEvent))) {
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

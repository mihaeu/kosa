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
import { IllegalActionError } from "./IllegalActionError";
import { LocationAlreadyHasAnotherBuildingError } from "./LocationAlreadyHasAnotherBuildingError";
import { LocationNotInTerritoryError } from "./LocationNotInTerritoryError";
import { NotEnoughCoinsError } from "./NotEnoughCoinsError";
import { NotEnoughPopularityError } from "./NotEnoughPopularityError";
import { NotEnoughPowerError } from "./NotEnoughPowerError";
import { NotEnoughResourcesError } from "./NotEnoughResourcesError";
import { BolsterCombatCardsOption } from "./Options/BolsterCombatCardsOption";
import { BolsterPowerOption } from "./Options/BolsterPowerOption";
import { Option } from "./Options/Option";
import { Player } from "./Player";
import { ProvidedResourcesNotAvailableError } from "./ProvidedResourcesNotAvailableError";
import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { TopAction } from "./TopAction";
import { UnitAlreadyDeployedError } from "./UnitAlreadyDeployedError";
import { UnitNotDeployedError } from "./UnitNotDeployedError";
import { Unit } from "./Units/Unit";

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

export function availableBolsterOptions(log: EventLog, player: Player): Option[] {
    if (!isTopActionAvailable(log, GameInfo.players(log), player)(TopAction.BOLSTER)) {
        return [];
    }
    return [new BolsterPowerOption(), new BolsterCombatCardsOption()];
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

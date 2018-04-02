import * as _ from "ramda";
import { BottomAction } from "./BottomAction";
import { BuildingAlreadyBuildError } from "./BuildingAlreadyBuiltError";
import { BuildingType } from "./BuildingType";
import { CannotHaveMoreThan20PopularityError } from "./CannotHaveMoreThan20PopularityError";
import { CombatCard } from "./CombatCard";
import { ActionEvent } from "./Events/ActionEvent";
import { BuildEvent } from "./Events/BuildEvent";
import { CoinEvent } from "./Events/CoinEvent";
import { GainCombatCardEvent } from "./Events/CombatCardEvent";
import { DeployEvent } from "./Events/DeployEvent";
import { EnlistEvent } from "./Events/EnlistEvent";
import { EventLog } from "./Events/EventLog";
import { GainResourceEvent } from "./Events/GainResourceEvent";
import { GameEndEvent } from "./Events/GameEndEvent";
import { MoveEvent } from "./Events/MoveEvent";
import { PassEvent } from "./Events/PassEvent";
import { PopularityEvent } from "./Events/PopularityEvent";
import { PowerEvent } from "./Events/PowerEvent";
import { SpendResourceEvent } from "./Events/SpendResourceEvent";
import { StarEvent } from "./Events/StarEvent";
import { UpgradeEvent } from "./Events/UpgradeEvent";
import { Field } from "./Field";
import { FieldType } from "./FieldType";
import { GameInfo } from "./GameInfo";
import { GameMap } from "./GameMap";
import { IllegalActionError } from "./IllegalActionError";
import { IllegalMoveError } from "./IllegalMoveError";
import { LocationAlreadyHasAnotherBuildingError } from "./LocationAlreadyHasAnotherBuildingError";
import { LocationNotInTerritoryError } from "./LocationNotInTerritoryError";
import { NotEnoughCoinsError } from "./NotEnoughCoinsError";
import { NotEnoughPopularityError } from "./NotEnoughPopularityError";
import { NotEnoughPowerError } from "./NotEnoughPowerError";
import { NotEnoughResourcesError } from "./NotEnoughResourcesError";
import { Player } from "./Player";
import { ProvidedResourcesNotAvailableError } from "./ProvidedResourcesNotAvailableError";
import { RecruitReward } from "./RecruitReward";
import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { Star } from "./Star";
import { TopAction } from "./TopAction";
import { UnitAlreadyDeployedError } from "./UnitAlreadyDeployedError";
import { UnitNotDeployedError } from "./UnitNotDeployedError";
import { Mech } from "./Units/Mech";
import { Unit } from "./Units/Unit";
import { Worker } from "./Units/Worker";

export class Game {
    private static MAX_POWER = 16;
    private static MAX_POPULARITY = 18;

    private static MAX_WORKERS = 8;
    private static PRODUCE_POWER_THRESHOLD = 4;
    private static PRODUCE_POPULARITY_THRESHOLD = 6;

    private static PRODUCE_COINS_THRESHOLD = 8;

    private static TOP_ACTIONS = [TopAction.MOVE, TopAction.TRADE, TopAction.PRODUCE, TopAction.BOLSTER];

    private static BOTTOM_ACTIONS = [
        BottomAction.UPGRADE,
        BottomAction.DEPLOY,
        BottomAction.BUILD,
        BottomAction.ENLIST,
    ];

    private static assertLegalMove(currentLocation: Field, destination: Field, unit: Unit): void {
        if (!GameMap.isReachable(currentLocation, destination)) {
            throw new IllegalMoveError(unit, currentLocation, destination);
        }
    }

    private static actionFromTheSameColumn(
        currentAction: TopAction | BottomAction,
        lastAction: TopAction | BottomAction,
        player: Player,
    ) {
        return (
            currentAction === lastAction ||
            (lastAction in TopAction &&
                currentAction in BottomAction &&
                player.playerMat.topActionMatchesBottomAction(lastAction, currentAction)) ||
            (lastAction in BottomAction &&
                currentAction in TopAction &&
                player.playerMat.topActionMatchesBottomAction(currentAction, lastAction))
        );
    }

    private static playerPlaysBottomActionAfterTopAction(
        lastPlayer: Player,
        playerOrder: Player[],
        player: Player,
        action: TopAction | BottomAction,
    ): boolean {
        return lastPlayer === playerOrder[playerOrder.indexOf(player)] && action in BottomAction;
    }

    public log: EventLog;

    public constructor(private readonly players: Player[], log: EventLog = new EventLog()) {
        this.players = players;
        this.log = log;

        for (const player of this.players) {
            player.setupEvents.forEach((event) => this.log.add(event));
            player.playerMat.setupEvents.forEach((event) => this.log.add(event));
        }
    }

    public availableTopActions(player: Player): TopAction[] {
        return _.filter((topAction: TopAction): boolean => {
            try {
                this.assertActionCanBeTaken(player, topAction);
                this.assertCoins(player, player.playerMat.topActionCost(topAction));
                return true;
            } catch (error) {
                return false;
            }
        }, Game.TOP_ACTIONS);
    }

    public availableBottomActions(player: Player): BottomAction[] {
        return _.filter((bottomAction: BottomAction): boolean => {
            try {
                this.assertActionCanBeTaken(player, bottomAction);
                const { resourceType, count } = player.playerMat.bottomActionCost(bottomAction);
                return GameInfo.resources(this.log, player).countByType(resourceType) >= count;
            } catch (error) {
                return false;
            }
        }, Game.BOTTOM_ACTIONS);
    }

    public move(player: Player, unit: Unit, destination: Field) {
        this.assertActionCanBeTaken(player, TopAction.MOVE);
        this.assertUnitDeployed(player, unit);

        const currentLocation = GameInfo.unitLocation(this.log, player, unit);
        Game.assertLegalMove(currentLocation, destination, unit);

        this.log
            .add(new ActionEvent(player.playerId, TopAction.MOVE))
            .add(new MoveEvent(player.playerId, unit, destination));
        return this.pass(player, TopAction.MOVE);
    }

    public gainCoins(player: Player): Game {
        this.assertActionCanBeTaken(player, TopAction.MOVE);

        this.log.add(new ActionEvent(player.playerId, TopAction.MOVE)).add(new CoinEvent(player.playerId, +1));
        return this.pass(player, TopAction.MOVE);
    }

    public bolsterPower(player: Player): Game {
        const currentPower = GameInfo.power(this.log, player);
        const gainedPower = currentPower + 2 > Game.MAX_POWER ? Game.MAX_POWER - currentPower : 2;
        return this.bolster(player, new PowerEvent(player.playerId, gainedPower));
    }

    public bolsterCombatCards(player: Player): Game {
        return this.bolster(player, new GainCombatCardEvent(player.playerId, new CombatCard(2)));
    }

    public tradeResources(player: Player, worker: Worker, resource1: ResourceType, resource2: ResourceType): Game {
        this.assertActionCanBeTaken(player, TopAction.TRADE);
        this.assertCoins(player, 1);
        this.assertUnitDeployed(player, worker);

        const workerLocation = GameInfo.unitLocation(this.log, player, worker);
        this.log
            .add(new ActionEvent(player.playerId, TopAction.TRADE))
            .add(new CoinEvent(player.playerId, -1))
            .add(
                new GainResourceEvent(player.playerId, [
                    new Resource(workerLocation, resource1),
                    new Resource(workerLocation, resource2),
                ]),
            );

        return this.pass(player, TopAction.TRADE);
    }

    public tradePopularity(player: Player): Game {
        this.assertActionCanBeTaken(player, TopAction.TRADE);
        this.assertCoins(player, 1);
        this.assertNotMoreThan20Popularity(player);

        const gainedPopularity = GameInfo.popularity(this.log, player) === Game.MAX_POPULARITY ? 0 : 1;
        this.log
            .add(new ActionEvent(player.playerId, TopAction.TRADE))
            .add(new CoinEvent(player.playerId, -1))
            .add(new PopularityEvent(player.playerId, gainedPopularity));

        return this.pass(player, TopAction.TRADE);
    }

    public produce(player: Player, field1: Field, field2: Field): Game {
        this.assertActionCanBeTaken(player, TopAction.PRODUCE);
        this.assertLocationControlledByPlayer(player, field1);
        this.assertLocationControlledByPlayer(player, field2);
        if (field1 === field2) {
            throw new IllegalActionError(`Field 1 (${field1}) and Field 2 (${field2}) are the same`);
        }
        const allWorkersCount = GameInfo.allWorkers(this.log, player).length;
        if (allWorkersCount >= Game.PRODUCE_POWER_THRESHOLD) {
            this.assertPower(player, 1);
        }

        if (allWorkersCount >= Game.PRODUCE_POPULARITY_THRESHOLD) {
            this.assertPopularity(player, 1);
        }

        if (allWorkersCount >= Game.PRODUCE_COINS_THRESHOLD) {
            this.assertCoins(player, 1);
        }

        this.log.add(new ActionEvent(player.playerId, TopAction.PRODUCE));

        if (allWorkersCount >= Game.PRODUCE_POWER_THRESHOLD) {
            this.log.add(new PowerEvent(player.playerId, -1));
        }

        if (allWorkersCount >= Game.PRODUCE_POPULARITY_THRESHOLD) {
            this.log.add(new PopularityEvent(player.playerId, -1));
        }

        if (allWorkersCount >= Game.PRODUCE_COINS_THRESHOLD) {
            this.log.add(new CoinEvent(player.playerId, -1));
        }

        this.produceOnField(player, field1);
        this.produceOnField(player, field2);
        return this.pass(player, TopAction.PRODUCE);
    }

    public build(player: Player, worker: Worker, building: BuildingType, resources: Resource[]): Game {
        this.assertActionCanBeTaken(player, BottomAction.BUILD);
        this.assertUnitDeployed(player, worker);
        this.assertBuildingNotAlreadyBuilt(player, building);

        const { resourceType, count } = player.playerMat.bottomActionCost(BottomAction.BUILD);
        this.assertAvailableResources(player, resourceType, count, resources);

        const location = GameInfo.unitLocation(this.log, player, worker);
        this.assertLocationHasNoOtherBuildings(player, location);

        this.log
            .add(new ActionEvent(player.playerId, BottomAction.BUILD))
            .add(new SpendResourceEvent(player.playerId, resources))
            .add(new BuildEvent(player.playerId, location, building));
        return this.pass(player, BottomAction.BUILD);
    }

    public pass(player: Player, action: TopAction | BottomAction): Game {
        this.handOutStars(player);

        if (action in TopAction && this.availableBottomActions(player).length > 0) {
            return this;
        }

        this.log.add(new PassEvent(player.playerId));
        return this;
    }

    public deploy(player: Player, worker: Worker, mech: Mech, resources: Resource[]) {
        this.assertActionCanBeTaken(player, BottomAction.DEPLOY);
        this.assertAvailableResources(
            player,
            ResourceType.METAL,
            player.playerMat.bottomActionCost(BottomAction.DEPLOY).count,
            resources,
        );
        this.assertUnitNotDeployed(player, mech);

        const location = GameInfo.unitLocation(this.log, player, worker);
        this.log
            .add(new ActionEvent(player.playerId, BottomAction.DEPLOY))
            .add(new DeployEvent(player.playerId, mech, location));
        return this.pass(player, BottomAction.DEPLOY);
    }

    public enlist(player: Player, bottomAction: BottomAction, recruitReward: RecruitReward, resources: Resource[]) {
        this.assertActionCanBeTaken(player, BottomAction.ENLIST);
        this.assertAvailableResources(
            player,
            ResourceType.FOOD,
            player.playerMat.bottomActionCost(BottomAction.ENLIST).count,
            resources,
        );

        this.log
            .add(new ActionEvent(player.playerId, BottomAction.ENLIST))
            .addIfNew(new EnlistEvent(player.playerId, recruitReward, bottomAction))
            .add(new SpendResourceEvent(player.playerId, resources));
        return this.pass(player, BottomAction.ENLIST);
    }

    public upgrade(player: Player, topAction: TopAction, bottomAction: BottomAction, resources: Resource[]) {
        this.assertActionCanBeTaken(player, BottomAction.UPGRADE);
        this.assertAvailableResources(
            player,
            ResourceType.OIL,
            player.playerMat.bottomActionCost(BottomAction.UPGRADE).count,
            resources,
        );

        this.log
            .add(new ActionEvent(player.playerId, BottomAction.UPGRADE))
            .add(new UpgradeEvent(player.playerId, topAction, bottomAction));
        return this.pass(player, BottomAction.UPGRADE);
    }

    private bolster(player: Player, event: PowerEvent | GainCombatCardEvent): Game {
        this.assertActionCanBeTaken(player, TopAction.BOLSTER);
        this.assertCoins(player, 1);

        this.log
            .add(new ActionEvent(player.playerId, TopAction.BOLSTER))
            .add(event)
            .add(new CoinEvent(player.playerId, -1));
        return this.pass(player, TopAction.BOLSTER);
    }

    private produceOnField(player: Player, location: Field): void {
        const workers = GameInfo.workersOnLocation(this.log, player, location);
        if (workers === 0) {
            return;
        }

        const allWorkers = GameInfo.allWorkers(this.log, player);
        const currentWorkerCount = allWorkers.length;
        if (location.type === FieldType.VILLAGE && currentWorkerCount !== Game.MAX_WORKERS) {
            const workersToDeploy =
                workers + currentWorkerCount > Game.MAX_WORKERS ? Game.MAX_WORKERS - currentWorkerCount : workers;
            for (let i = 1; i <= workersToDeploy; i += 1) {
                // @ts-ignore
                const newWorker = Worker[`WORKER_${currentWorkerCount + i}`];
                this.log.add(new DeployEvent(player.playerId, newWorker, location));
            }
            return;
        }

        let typeToProduce: ResourceType = ResourceType.METAL;
        switch (location.type) {
            case FieldType.TUNDRA:
                typeToProduce = ResourceType.OIL;
                break;
            case FieldType.FOREST:
                typeToProduce = ResourceType.WOOD;
                break;
            case FieldType.FARM:
                typeToProduce = ResourceType.FOOD;
                break;
            case FieldType.MOUNTAIN:
                typeToProduce = ResourceType.METAL;
                break;
            default:
                return;
        }
        const resources: Resource[] = [];
        for (let i = 0; i < workers; i += 1) {
            resources.push(new Resource(location, typeToProduce));
        }
        this.log.add(new GainResourceEvent(player.playerId, resources));
    }

    private handOutStars(player: Player): void {
        const allStars = [
            Star.ALL_UPGRADES,
            Star.ALL_MECHS,
            Star.ALL_BUILDINGS,
            Star.ALL_RECRUITS,
            Star.ALL_WORKERS,
            Star.FIRST_OBJECTIVE,
            Star.FIRST_COMBAT_WIN,
            Star.SECOND_COMBAT_WIN,
            Star.MAX_POPULARITY,
            Star.MAX_POWER,
        ];

        const currentStars = GameInfo.stars(this.log, player);
        let starCount = currentStars.length;
        const missingStars = _.difference(allStars, currentStars);
        missingStars.forEach((star: Star) => {
            if (GameInfo.starCondition(this.log, player, star)) {
                this.log.add(new StarEvent(player.playerId, star));
                starCount += 1;
            }

            if (starCount === 6) {
                this.log.add(new GameEndEvent(player.playerId));
                return;
            }
        });
    }

    private assertLocationControlledByPlayer(player: Player, location: Field) {
        const territory = GameInfo.territories(this.log, player);
        if (!_.contains(location, territory)) {
            throw new LocationNotInTerritoryError(location, territory);
        }
    }

    private assertAvailableResources(player: Player, type: ResourceType, required: number, resources: Resource[]) {
        const availableResourcesCount = GameInfo.resources(this.log, player).countByType(type);
        if (availableResourcesCount < required) {
            throw new NotEnoughResourcesError(type, required, availableResourcesCount);
        }

        const availableResources = GameInfo.availableResources(this.log, player);
        if (resources.some((resource) => !_.contains(resource, availableResources))) {
            throw new ProvidedResourcesNotAvailableError(resources, availableResources);
        }
    }

    private assertCoins(player: Player, required: number): void {
        const coins = GameInfo.coins(this.log, player);
        if (coins < required) {
            throw new NotEnoughCoinsError(1, coins);
        }
    }

    private assertPopularity(player: Player, required: number): void {
        const popularity = GameInfo.popularity(this.log, player);
        if (popularity < required) {
            throw new NotEnoughPopularityError(1, popularity);
        }
    }

    private assertPower(player: Player, required: number): void {
        const power = GameInfo.power(this.log, player);
        if (power < required) {
            throw new NotEnoughPowerError(1, power);
        }
    }

    private assertUnitDeployed(player: Player, unit: Unit): void {
        if (_.none((event) => event.unit === unit, this.log.filterBy(player.playerId, DeployEvent) as DeployEvent[])) {
            throw new UnitNotDeployedError(unit);
        }
    }

    private assertUnitNotDeployed(player: Player, unit: Unit): void {
        if (_.any((event) => event.unit === unit, this.log.filterBy(player.playerId, DeployEvent) as DeployEvent[])) {
            throw new UnitAlreadyDeployedError(unit);
        }
    }

    private assertBuildingNotAlreadyBuilt(player: Player, building: BuildingType): void {
        if (
            !_.none(
                (event) => building === (event as BuildEvent).building,
                this.log.filterBy(player.playerId, BuildEvent),
            )
        ) {
            throw new BuildingAlreadyBuildError(building);
        }
    }

    private assertLocationHasNoOtherBuildings(player: Player, location: Field): void {
        if (
            !_.none(
                (event) => location === (event as BuildEvent).location,
                this.log.filterBy(player.playerId, BuildEvent),
            )
        ) {
            throw new LocationAlreadyHasAnotherBuildingError(location);
        }
    }

    private assertActionCanBeTaken(player: Player, currentAction: TopAction | BottomAction): void {
        if (this.gameJustStarted() && !this.playerIsFirstPlayer(player)) {
            throw new IllegalActionError("You are not the starting player.");
        }

        const lastAction = this.lastActionFor(player);
        if (lastAction === null) {
            return;
        }

        if (!this.playerIsNext(player, currentAction)) {
            throw new IllegalActionError("It is not your turn yet.");
        }

        if (this.isFirstActionThisTurn(player) && Game.actionFromTheSameColumn(lastAction, currentAction, player)) {
            throw new IllegalActionError("Cannot use actions from the same column.");
        }

        if (
            !this.isFirstActionThisTurn(player) &&
            currentAction in BottomAction &&
            lastAction in TopAction &&
            this.lastPlayer() === player &&
            !player.playerMat.topActionMatchesBottomAction(lastAction, currentAction)
        ) {
            throw new IllegalActionError("Cannot use this bottom action with the last top action.");
        }
    }

    private assertNotMoreThan20Popularity(player: Player) {
        if (GameInfo.popularity(this.log, player) > 20) {
            throw new CannotHaveMoreThan20PopularityError();
        }
    }

    private isFirstActionThisTurn(player: Player): boolean {
        return this.log.lastOfTwo(player.playerId, ActionEvent, PassEvent) instanceof PassEvent;
    }

    private gameJustStarted(): boolean {
        return this.log.lastInstanceOf(ActionEvent) === null;
    }

    private lastActionFor(player: Player): TopAction | BottomAction | null {
        const lastActionEvent = this.log.lastInstanceOf(ActionEvent, (event) => event.playerId === player.playerId);
        return lastActionEvent !== null ? (lastActionEvent as ActionEvent).action : null;
    }

    private playerIsFirstPlayer(currentPlayer: Player): boolean {
        for (const otherPlayer of this.players) {
            if (otherPlayer.playerMat.startPosition < currentPlayer.playerMat.startPosition) {
                return false;
            }
        }
        return true;
    }

    private lastPlayer(): Player | null {
        const lastActionEvent = this.log.lastInstanceOf(ActionEvent, () => true);
        if (lastActionEvent === null) {
            return null;
        }

        for (const player of this.players) {
            if (player.playerId === lastActionEvent.playerId) {
                return player;
            }
        }
        return null;
    }

    private playerIsNext(player: Player, action: TopAction | BottomAction): boolean {
        const lastPlayer = this.lastPlayer();
        if (lastPlayer === null) {
            return true;
        }

        const playerOrder = GameInfo.playerOrder(this.players);
        if (playerOrder.lastIndexOf(lastPlayer) === playerOrder.length - 1 && playerOrder.indexOf(player) === 0) {
            return true;
        }

        return (
            Game.playerPlaysBottomActionAfterTopAction(lastPlayer, playerOrder, player, action) ||
            lastPlayer === playerOrder[playerOrder.indexOf(player) - 1]
        );
    }
}

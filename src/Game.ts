import * as _ from "ramda";
import {GameMap} from "./GameMap";
import {Field} from "./Field";
import {GainCombatCardEvent} from "./Events/CombatCardEvent";
import {CombatCard} from "./CombatCard";
import {Event} from "./Events/Event";
import {CoinEvent} from "./Events/CoinEvent";
import {PowerEvent} from "./Events/PowerEvent";
import {NotEnoughCoinsError} from "./NotEnoughCoinsError";
import {MoveEvent} from "./Events/MoveEvent";
import {Unit} from "./Units/Unit";
import {UnitNotDeployedError} from "./UnitNotDeployedError";
import {IllegalMoveError} from "./IllegalMoveError";
import {Worker} from "./Units/Worker";
import {ResourceType} from "./ResourceType";
import {GainResourceEvent} from "./Events/GainResourceEvent";
import {Resources} from "./Resources";
import {BuildingType} from "./BuildingType";
import {BuildEvent} from "./Events/BuildEvent";
import {BuildingAlreadyBuildError} from "./BuildingAlreadyBuiltError";
import {LocationAlreadyHasAnotherBuildingError} from "./LocationAlreadyHasAnotherBuildingError";
import {EventLog} from "./Events/EventLog";
import {DeployEvent} from "./Events/DeployEvent";
import {LocationEvent} from "./Events/LocationEvent";
import {NotEnoughResourcesError} from "./NotEnoughResourcesError";
import {Resource} from "./Resource";
import {SpendResourceEvent} from "./Events/SpendResourceEvent";
import {ResourceEvent} from "./Events/ResourceEvent";
import {Building} from "./Building";
import {ProvidedResourcesNotAvailableError} from "./ProvidedResourcesNotAvailableError";
import {PopularityEvent} from "./Events/PopularityEvent";
import {CannotHaveMoreThan20PopularityError} from "./CannotHaveMoreThan20PopularityError";
import {ActionEvent} from "./Events/ActionEvent";
import {TopAction} from "./TopAction";
import {BottomAction} from "./BottomAction";
import {IllegalActionError} from "./IllegalActionError";
import {Player} from "./Player";
import {Mech} from "./Units/Mech";
import {RecruitReward} from "./RecruitReward";

export class Game {
    private log: EventLog;
    private static TOP_ACTIONS = [TopAction.MOVE, TopAction.TRADE, TopAction.PRODUCE, TopAction.BOLSTER];
    private static BOTTOM_ACTIONS = [BottomAction.UPGRADE, BottomAction.DEPLOY, BottomAction.BUILD, BottomAction.ENLIST];

    public constructor(log: EventLog = new EventLog, private readonly players: Player[]) {
        this.log = log;
        this.players = players;

        for (const player of this.players) {
            player.setupEvents.forEach(event => this.log.add(event));
            player.playerMat.setupEvents.forEach(event => this.log.add(event));
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
                const {resourceType, count} = player.playerMat.bottomActionCost(bottomAction);
                return this.resources(player).countByType(resourceType) >= count;
            } catch (error) {
                return false;
            }
        }, Game.BOTTOM_ACTIONS);
    }

    public move(player: Player, unit: Unit, destination: Field) {
        this.assertActionCanBeTaken(player, TopAction.MOVE);
        this.assertUnitDeployed(player, unit);

        let currentLocation = this.unitLocation(player, unit);
        Game.assertLegalMove(currentLocation, destination, unit);

        this.log
            .add(new ActionEvent(player.playerId, TopAction.MOVE))
            .add(new MoveEvent(player.playerId, unit, destination));
        return this;
    }

    public gainCoins(player: Player): Game {
        this.assertActionCanBeTaken(player, TopAction.MOVE);

        this.log
            .add(new ActionEvent(player.playerId, TopAction.MOVE))
            .add(new CoinEvent(player.playerId, +1));
        return this;
    }

    public bolsterPower(player: Player): Game {
        return this.bolster(player, new PowerEvent(player.playerId, +2));
    }

    public bolsterCombatCards(player: Player): Game {
        return this.bolster(player, new GainCombatCardEvent(player.playerId, new CombatCard(2)));
    }

    private bolster(player: Player, event: PowerEvent|GainCombatCardEvent): Game {
        this.assertActionCanBeTaken(player, TopAction.BOLSTER);
        this.assertCoins(player, 1);

        this.log
            .add(new ActionEvent(player.playerId, TopAction.BOLSTER))
            .add(event)
            .add(new CoinEvent(player.playerId, -1));
        return this;
    }

    public tradeResources(player: Player, worker: Worker, resource1: ResourceType, resource2: ResourceType): Game {
        this.assertActionCanBeTaken(player, TopAction.TRADE);
        this.assertCoins(player, 1);
        this.assertUnitDeployed(player, worker);

        const workerLocation = this.unitLocation(player, worker);
        this.log
            .add(new ActionEvent(player.playerId, TopAction.TRADE))
            .add(new CoinEvent(player.playerId, -1))
            .add(new GainResourceEvent(player.playerId, [
                new Resource(workerLocation, resource1),
                new Resource(workerLocation, resource2),
            ]));

        return this;
    }

    public tradePopularity(player: Player): Game {
        this.assertActionCanBeTaken(player, TopAction.TRADE);
        this.assertCoins(player, 1);
        this.assertNotMoreThan20Popularity(player);

        this.log
            .add(new ActionEvent(player.playerId, TopAction.TRADE))
            .add(new CoinEvent(player.playerId, -1))
            .add(new PopularityEvent(player.playerId, 1));

        return this;
    }

    public produce(player: Player): Game {
        this.assertActionCanBeTaken(player, TopAction.PRODUCE);

        this.log
            .add(new ActionEvent(player.playerId, TopAction.PRODUCE));

        return this;
    }

    public build(player: Player, worker: Worker, building: BuildingType, resources: Resource[]): Game {
        this.assertActionCanBeTaken(player, BottomAction.BUILD);
        this.assertUnitDeployed(player, worker);
        this.assertBuildingNotAlreadyBuilt(player, building);

        const {resourceType, count} = player.playerMat.bottomActionCost(BottomAction.BUILD);
        this.assertAvailableResources(player, resourceType, count, resources);

        const location = this.unitLocation(player, worker);
        this.assertLocationHasNoOtherBuildings(player, location);

        this.log
            .add(new ActionEvent(player.playerId, BottomAction.BUILD))
            .add(new SpendResourceEvent(player.playerId, resources))
            .add(new BuildEvent(player.playerId, location, building));
        return this;
    }

    public units(player: Player): Map<Unit, Field> {
        let unitLocations = new Map<Unit, Field>();
        _.forEach((locationEvent: LocationEvent) => {
            unitLocations.set(locationEvent.unit, locationEvent.destination);
        }, this.log.filterBy(player.playerId, LocationEvent) as LocationEvent[]);
        return unitLocations;
    }

    public territories(player: Player): Field[] {
        return _.uniq(Array.from(this.units(player).values()));
    }

    public deploy(player: Player, worker: Worker, mech: Mech, resources: Resource[]) {
        this.assertActionCanBeTaken(player, BottomAction.DEPLOY);
        this.assertAvailableResources(player, ResourceType.METAL, player.playerMat.bottomActionCost(BottomAction.DEPLOY).count, resources);

        const location = this.unitLocation(player, worker);
        this.log
            .add(new ActionEvent(player.playerId, BottomAction.DEPLOY))
            .add(new DeployEvent(player.playerId, mech, location));
        return this;
    }

    public enlist(player: Player, bottomAction: BottomAction, recruiter: RecruitReward, resources: Resource[]) {
        this.assertActionCanBeTaken(player, BottomAction.ENLIST);
        this.assertAvailableResources(player, ResourceType.FOOD, player.playerMat.bottomActionCost(BottomAction.ENLIST).count, resources);

        this.log
            .add(new ActionEvent(player.playerId, BottomAction.ENLIST));
        return this;
    }

    public upgrade(player: Player, topAction: TopAction, bottomAction: BottomAction, resources: Resource[]) {
        this.assertActionCanBeTaken(player, BottomAction.UPGRADE);
        this.assertAvailableResources(player, ResourceType.OIL, player.playerMat.bottomActionCost(BottomAction.UPGRADE).count, resources);

        this.log
            .add(new ActionEvent(player.playerId, BottomAction.UPGRADE));
        return this;
    }

    private assertAvailableResources(player: Player, type: ResourceType, required: number, resources: Resource[]) {
        const availableResourcesCount = this.resources(player).countByType(type);
        if (availableResourcesCount < required) {
            throw new NotEnoughResourcesError(type, required, availableResourcesCount);
        }

        const availableResources = this.availableResources(player);
        if (!resources.every(resource => availableResources.indexOf(resource) !== -1)) {
            throw new ProvidedResourcesNotAvailableError(resources, availableResources);
        }
    }

    private static assertLegalMove(currentLocation: Field, destination: Field, unit: Unit): void {
        if (!GameMap.isReachable(currentLocation, destination)) {
            throw new IllegalMoveError(unit, currentLocation, destination);
        }
    }

    private assertCoins(player: Player, required: number): void {
        let coins = this.coins(player);
        if (coins < required) {
            throw new NotEnoughCoinsError(1, coins);
        }
    }

    private assertUnitDeployed(player: Player, unit: Unit): void {
        if (_.none(event => event.unit === unit, <DeployEvent[]> this.log.filterBy(player.playerId, DeployEvent))) {
            throw new UnitNotDeployedError(unit);
        }
    }

    private assertBuildingNotAlreadyBuilt(player: Player, building: BuildingType): void {
        if (!_.none(event => building === (event as BuildEvent).building, this.log.filterBy(player.playerId, BuildEvent))) {
            throw new BuildingAlreadyBuildError(building);
        }
    }

    private assertLocationHasNoOtherBuildings(player: Player, location: Field): void {
        if (!_.none(event => location === (event as BuildEvent).location, this.log.filterBy(player.playerId, BuildEvent))) {
            throw new LocationAlreadyHasAnotherBuildingError(location);
        }
    }

    private static actionFromTheSameColumn(
        currentAction: TopAction | BottomAction,
        lastAction: TopAction | BottomAction,
        player: Player,
    ) {
        return currentAction === lastAction
            || (lastAction in TopAction
                && currentAction in BottomAction
                && player.playerMat.topActionMatchesBottomAction(lastAction, currentAction))
            || (lastAction in BottomAction
                && currentAction in TopAction
                && player.playerMat.topActionMatchesBottomAction(currentAction, lastAction));
    }

    private assertActionCanBeTaken(player: Player, currentAction: TopAction | BottomAction): void {
        if (this.gameJustStarted() && !this.playerIsFirstPlayer(player)) {
            throw new IllegalActionError("You are not the starting player.")
        }

        const lastAction = this.lastActionFor(player);
        if (lastAction === null) {
            return;
        }

        if (!this.playerIsNext(player, currentAction)) {
            throw new IllegalActionError("It is not your turn yet.")
        }

        if (Game.actionFromTheSameColumn(lastAction, currentAction, player)) {
            throw new IllegalActionError("Cannot use actions from the same column.");
        }

        if (currentAction in BottomAction
            && lastAction in TopAction
            && this.lastPlayer() === player
            && !player.playerMat.topActionMatchesBottomAction(lastAction, currentAction)) {
            throw new IllegalActionError("Cannot use this bottom action with the last top action.");
        }
    }

    private gameJustStarted(): boolean {
        return this.log.lastOf(ActionEvent, () => true) === null;
    }

    private lastActionFor(player: Player): TopAction|BottomAction|null {
        const lastActionEvent = this.log.lastOf(ActionEvent, event => event.playerId === player.playerId);
        return lastActionEvent !== null
            ? (lastActionEvent as ActionEvent).action
            : null;
    }

    private playerIsFirstPlayer(currentPlayer: Player): boolean {
        for (const otherPlayer of this.players) {
            if (otherPlayer.playerMat.startPosition < currentPlayer.playerMat.startPosition) {
                return false;
            }
        }
        return true;
    }

    public unitLocation(player: Player, unit: Unit): Field {
        const moves = (<LocationEvent[]> this.log.filterBy(player.playerId, LocationEvent)).filter(event => event.unit === unit);
        return moves[moves.length - 1].destination;
    }

    public power(player: Player): number {
        // @ts-ignore
        return _.sum(_.pluck("power", this.log.filterBy(player.playerId, PowerEvent)));
    }

    public coins(player: Player): number {
        // @ts-ignore
        return _.sum(_.pluck("coins", this.log.filterBy(player.playerId, CoinEvent)));
    }

    public combatCards(player: Player): CombatCard[] {
        // @ts-ignore
        return _.pluck("combatCard", this.log.filterBy(player.playerId, GainCombatCardEvent));
    }

    public resources(player: Player): Resources {
        const availableResources = this.availableResources(player);
        return new Resources(
            this.resourceByType(ResourceType.METAL, availableResources),
            this.resourceByType(ResourceType.FOOD, availableResources),
            this.resourceByType(ResourceType.OIL, availableResources),
            this.resourceByType(ResourceType.WOOD, availableResources),
        );
    }

    private resourceByType(type: ResourceType, resources: Resource[]): number {
        return _.reduce(
            (sum, resource: Resource) => resource.type === type ? sum + 1 : sum,
            0,
            resources
        );
    }

    public buildings(player: Player): Building[] {
        return _.map(Building.fromEvent, <BuildEvent[]> this.log.filterBy(player.playerId, BuildEvent));
    }

    /**
     * @FIXME this should simply be all gained resources x all spent resources x all territories of that player
     *
     * @param {Player} player
     * @returns {Resource[]}
     */
    public availableResources(player: Player): Resource[] {
        const extractResource = (event: ResourceEvent) => event.resources;
        let gained = _.chain(extractResource, <GainResourceEvent[]> this.log.filter(GainResourceEvent));
        let spent = _.chain(extractResource, <SpendResourceEvent[]> this.log.filter(SpendResourceEvent));
        for (let spentResource of spent) {
            for (let gainedResource of gained) {
                if (spentResource.location === gainedResource.location
                    && spentResource.type === gainedResource.type
                ) {
                    gained.splice(gained.indexOf(gainedResource), 1);
                    break;
                }
            }
        }
        const territories = this.territories(player);
        return _.filter(resource => territories.indexOf(resource.location) >= 0, gained);
    }

    public popularity(player: Player): number {
        return _.sum(_.map(event => event.popularity, <PopularityEvent[]> this.log.filterBy(player.playerId, PopularityEvent)));
    }

    private assertNotMoreThan20Popularity(player: Player) {
        if (this.popularity(player) > 20) {
            throw new CannotHaveMoreThan20PopularityError();
        }
    }

    /**
     * @deprecated this is only for testing purposes
     *
     * @param {Event} event
     * @returns {Game}
     */
    public addEvent(event: Event): Game {
        this.log.add(event);

        return this;
    }

    private lastPlayer(): Player|null {
        const lastActionEvent = this.log.lastOf(ActionEvent, () => true);
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

    private playerOrder(): Player[] {
        return _.sort(_.comparator((player1: Player, player2: Player) => {
            return Player.FACTION_TURN_ORDER.indexOf(player1.faction) < Player.FACTION_TURN_ORDER.indexOf(player2.faction);
        }), this.players);
    }

    private playerIsNext(player: Player, action: TopAction | BottomAction): boolean {
        const lastPlayer = this.lastPlayer();
        if (lastPlayer === null) {
            return true;
        }

        const playerOrder = this.playerOrder();
        if (playerOrder.lastIndexOf(lastPlayer) === playerOrder.length - 1 && playerOrder.indexOf(player) === 0) {
            return true;
        }

        return Game.playerPlaysBottomActionAfterTopAction(lastPlayer, playerOrder, player, action)
            || lastPlayer === playerOrder[playerOrder.indexOf(player) - 1];
    }

    private static playerPlaysBottomActionAfterTopAction(
        lastPlayer: Player,
        playerOrder: Player[],
        player: Player,
        action: TopAction | BottomAction
    ): boolean {
        return lastPlayer === playerOrder[playerOrder.indexOf(player)] && action in BottomAction;
    }
}

import * as _ from "ramda";
import {GameMap} from "./GameMap";
import {Field} from "./Field";
import {GainCombatCardEvent} from "./Events/CombatCardEvent";
import {CombatCard} from "./CombatCard";
import {CoinEvent} from "./Events/CoinEvent";
import {PowerEvent} from "./Events/PowerEvent";
import {NotEnoughCoinsError} from "./NotEnoughCoinsError";
import {MoveEvent} from "./Events/MoveEvent";
import {Unit} from "./Units/Unit";
import {UnitNotDeployedError} from "./UnitNotDeployedError";
import {IllegalMoveError} from "./IllegalMoveError";
import {Character} from "./Units/Character";
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
import {Faction} from "./Faction";
import {PlayerMat} from "./PlayerMat";
import {ActionEvent} from "./Events/ActionEvent";
import {TopAction} from "./TopAction";
import {BottomAction} from "./BottomAction";
import {IllegalActionError} from "./IllegalActionError";

export class Player {
    private log: EventLog;
    private playerMat: PlayerMat;

    public constructor(log: EventLog = new EventLog, faction: Faction, playerMat: PlayerMat) {
        this.log = log;
        this.playerMat = playerMat;

        this.log
            .add(new DeployEvent(Character.CHARACTER, Field.green))
            .add(new DeployEvent(Worker.WORKER_1, Field.m1))
            .add(new DeployEvent(Worker.WORKER_2, Field.f1));

        this.playerMat.setupEvents.forEach(event => this.log.add(event));
    }

    public move(unit: Unit, destination: Field) {
        this.assertTopActionAllowed(TopAction.MOVE);
        this.assertUnitDeployed(unit);

        let currentLocation = this.unitLocation(unit);
        Player.assertLegalMove(currentLocation, destination, unit);

        this.log
            .add(new ActionEvent(TopAction.MOVE))
            .add(new MoveEvent(unit, destination));
        return this;
    }

    public gainCoins(): Player {
        this.assertTopActionAllowed(TopAction.MOVE);

        this.log
            .add(new ActionEvent(TopAction.MOVE))
            .add(new CoinEvent(+1));
        return this;
    }

    public bolsterPower(): Player {
        return this.bolster(new PowerEvent(+2));
    }

    public bolsterCombatCards(): Player {
        return this.bolster(new GainCombatCardEvent(new CombatCard(2)));
    }

    private bolster(event: PowerEvent|GainCombatCardEvent): Player {
        this.assertTopActionAllowed(TopAction.BOLSTER);
        this.assertCoins(1);

        this.log
            .add(new ActionEvent(TopAction.BOLSTER))
            .add(event)
            .add(new CoinEvent(-1));
        return this;
    }

    public tradeResources(worker: Worker, resource1: ResourceType, resource2: ResourceType): Player {
        this.assertTopActionAllowed(TopAction.TRADE);
        this.assertCoins(1);
        this.assertUnitDeployed(worker);

        const workerLocation = this.unitLocation(worker);
        this.log
            .add(new ActionEvent(TopAction.TRADE))
            .add(new CoinEvent(-1))
            .add(new GainResourceEvent([
                new Resource(workerLocation, resource1),
                new Resource(workerLocation, resource2),
            ]));

        return this;
    }

    public tradePopularity(): Player {
        this.assertTopActionAllowed(TopAction.TRADE);
        this.assertCoins(1);
        this.assertNotMoreThan20Popularity();

        this.log
            .add(new ActionEvent(TopAction.TRADE))
            .add(new CoinEvent(-1))
            .add(new PopularityEvent(1));

        return this;
    }

    public produce(): Player {
        this.assertTopActionAllowed(TopAction.PRODUCE);

        this.log
            .add(new ActionEvent(TopAction.PRODUCE));

        return this;
    }

    public build(worker: Worker, building: BuildingType, resources: Resource[]): Player {
        this.assertBottomActionAllowed(BottomAction.BUILD);

        this.assertUnitDeployed(worker);
        this.assertBuildingNotAlreadyBuilt(building);
        this.assertAvailableResources(ResourceType.WOOD, 3, resources);

        const location = this.unitLocation(worker);
        this.assertLocationHasNoOtherBuildings(location);

        this.log
            .add(new ActionEvent(BottomAction.BUILD))
            .add(new SpendResourceEvent(resources))
            .add(new BuildEvent(location, building));
        return this;
    }

    public deploy() {
        this.assertBottomActionAllowed(BottomAction.DEPLOY);

        this.log
            .add(new ActionEvent(BottomAction.DEPLOY));
        return this;
    }

    public enlist() {
        this.assertBottomActionAllowed(BottomAction.ENLIST);

        this.log
            .add(new ActionEvent(BottomAction.ENLIST));
        return this;
    }

    public upgrade() {
        this.assertBottomActionAllowed(BottomAction.UPGRADE);

        this.log
            .add(new ActionEvent(BottomAction.UPGRADE));
        return this;
    }

    private assertAvailableResources(type: ResourceType, required: number, resources: Resource[]) {
        const availableResourcesCount = this.resources().countByType(type);
        if (availableResourcesCount < required) {
            throw new NotEnoughResourcesError(type, required, availableResourcesCount);
        }

        const availableResources = this.availableResources();
        if (!resources.every(resource => availableResources.indexOf(resource) !== -1)) {
            throw new ProvidedResourcesNotAvailableError(availableResources, resources);
        }
    }

    private static assertLegalMove(currentLocation: Field, destination: Field, unit: Unit): void {
        if (!GameMap.isReachable(currentLocation, destination)) {
            throw new IllegalMoveError(unit, currentLocation, destination);
        }
    }

    private assertCoins(required: number): void {
        let coins = this.coins();
        if (coins < required) {
            throw new NotEnoughCoinsError(1, coins);
        }
    }

    private assertUnitDeployed(unit: Unit): void {
        if (_.none(event => event.unit === unit, <DeployEvent[]> this.log.filter(DeployEvent))) {
            throw new UnitNotDeployedError(unit);
        }
    }

    private assertBuildingNotAlreadyBuilt(building: BuildingType): void {
        if (!_.none(event => building === event.building, <BuildEvent[]> this.log.filter(BuildEvent))) {
            throw new BuildingAlreadyBuildError(building);
        }
    }

    private assertLocationHasNoOtherBuildings(location: Field): void {
        if (!_.none(event => location === event.location, <BuildEvent[]> this.log.filter(BuildEvent))) {
            throw new LocationAlreadyHasAnotherBuildingError(location);
        }
    }

    private assertTopActionAllowed(topAction: TopAction): void {
        const lastAction = this.log.lastOf(ActionEvent);
        if (lastAction !== null && (lastAction as ActionEvent).action === topAction) {
            throw new IllegalActionError("Cannot use the same action twice.");
        }
    }

    private assertBottomActionAllowed(bottomAction: BottomAction): void {
        if (false) {
            throw new IllegalActionError("Cannot use this bottom action with the last top action.");
        }
    }

    public unitLocation(unit: Unit): Field {
        const moves = (<LocationEvent[]> this.log.filter(LocationEvent)).filter(event => event.unit === unit);
        return moves[moves.length - 1].destination;
    }

    public power(): number {
        return _.sum(_.map(event => event.power, <PowerEvent[]> this.log.filter(PowerEvent)));
    }

    public coins(): number {
        return _.sum(_.map(event => event.coins, <CoinEvent[]> this.log.filter(CoinEvent)));
    }

    public combatCards(): CombatCard[] {
        return _.map(event => event.combatCard, <GainCombatCardEvent[]> this.log.filter(GainCombatCardEvent));
    }

    public resources(): Resources {
        const availableResources = this.availableResources();
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

    public buildings(): Building[] {
        return _.map(Building.fromEvent, <BuildEvent[]> this.log.filter(BuildEvent));
    }

    public availableResources(): Resource[] {
        const extractResource = (event: ResourceEvent) => event.resources;
        let gained = _.chain(extractResource, <GainResourceEvent[]> this.log.filter(GainResourceEvent));
        let spent = _.chain(extractResource, <SpendResourceEvent[]> this.log.filter(SpendResourceEvent));
        for (let spentResource of spent) {
            for (let gainedResource of gained) {
                if (spentResource.location === gainedResource.location && spentResource.type === gainedResource.type) {
                    gained.splice(gained.indexOf(gainedResource), 1);
                    break;
                }
            }
        }
        return gained;
    }

    public popularity(): number {
        return _.sum(_.map(event => event.popularity, <PopularityEvent[]> this.log.filter(PopularityEvent)));
    }

    private assertNotMoreThan20Popularity() {
        if (this.popularity() > 20) {
            throw new CannotHaveMoreThan20PopularityError();
        }
    }

    /**
     * @deprecated this is only for testing purposes
     *
     * @param {Event} event
     * @returns {Player}
     */
    public addEvent(event: Event): Player {
        this.log.add(event);

        return this;
    }
}

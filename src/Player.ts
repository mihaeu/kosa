import * as _ from "ramda";
import {GameMap} from "./GameMap";
import {Field} from "./Field";
import {CombatCardEvent} from "./Events/CombatCardEvent";
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
import {Resource} from "./Resource";
import {ResourceEvent} from "./Events/ResourceEvent";
import {Resources} from "./Resources";
import {Building} from "./Building";
import {BuildEvent} from "./Events/BuildEvent";
import {BuildingAlreadyBuildError} from "./BuildingAlreadyBuiltError";
import {LocationAlreadyHasAnotherBuildingError} from "./LocationAlreadyHasAnotherBuildingError";
import {EventLog} from "./Events/EventLog";
import {DeployEvent} from "./Events/DeployEvent";
import {LocationEvent} from "./Events/LocationEvent";

export class Player {
    private log: EventLog = new EventLog;

    constructor(coins: number = 0, power: number = 0, combatCards: CombatCard[] = []) {
        combatCards.forEach(combatCard => this.log.add(new CombatCardEvent(combatCard)));

        this.log
            .add(new CoinEvent(coins))
            .add(new PowerEvent(power))
            .add(new DeployEvent(Character.CHARACTER, Field.green))
            .add(new DeployEvent(Worker.WORKER_1, Field.m1))
            .add(new DeployEvent(Worker.WORKER_2, Field.f1));
    }

    public move(unit: Unit, destination: Field) {
        this.assertUnitDeployed(unit);

        let currentLocation = this.unitLocation(unit);
        this.assertLegalMove(currentLocation, destination, unit);

        this.log.add(new MoveEvent(unit, destination));
        return this;
    }

    private assertLegalMove(currentLocation: Field, destination: Field, unit: Unit): void {
        if (!new GameMap().isReachable(currentLocation, destination)) {
            throw new IllegalMoveError(unit, currentLocation, destination);
        }
    }

    public gainCoins(): Player {
        this.log.add(new CoinEvent(+1));
        return this;
    }

    public bolsterPower(): Player {
        return this.bolster(new PowerEvent(+2));
    }

    public bolsterCombatCards(): Player {
        return this.bolster(new CombatCardEvent(new CombatCard(2)));
    }

    public trade(worker: Worker, resource1: Resource,  resource2: Resource): Player {
        this.assertCoins(1);
        this.assertUnitDeployed(worker);

        const workerLocation = this.unitLocation(worker);
        this.log
            .add(new ResourceEvent(workerLocation, resource1))
            .add(new ResourceEvent(workerLocation, resource2));

        return this;
    }

    public build(worker: Worker, building: Building): Player {
        this.assertUnitDeployed(worker);
        this.assertBuildingNotAlreadyBuilt(building);

        const location = this.unitLocation(worker);
        this.assertLocationHasNoOtherBuildings(location);

        this.log.add(new BuildEvent(location, building));

        return this;
    }

    public unitLocation(unit: Unit): Field {
        const moves = this.log.filter(LocationEvent).filter(event => event.unit === unit);
        return moves[moves.length - 1].destination;
    }

    private assertCoins(required: number): void {
        let coins = this.coins();
        if (coins < required) {
            throw new NotEnoughCoinsError(1, coins);
        }
    }

    private assertUnitDeployed(unit: Unit): void {
        if (_.none(event => event.unit === unit, this.log.filter(DeployEvent))) {
            throw new UnitNotDeployedError(unit);
        }
    }

    private assertBuildingNotAlreadyBuilt(building: Building): void {
        if (!_.none(event => building === event.building, this.log.filter(BuildEvent))) {
            throw new BuildingAlreadyBuildError(building);
        }
    }

    private assertLocationHasNoOtherBuildings(location: Field): void {
        if (!_.none(event => location === event.location, this.log.filter(BuildEvent))) {
            throw new LocationAlreadyHasAnotherBuildingError(location);
        }
    }

    private bolster(event: PowerEvent|CombatCardEvent): Player {
        this.assertCoins(1);

        this.log
            .add(event)
            .add(new CoinEvent(-1));
        return this;
    }

    public power(): number {
        return _.sum(_.map(event => event.power, this.log.filter(PowerEvent)));
    }

    public coins(): number {
        return _.sum(_.map(event => event.coins, this.log.filter(CoinEvent)));
    }

    public combatCards(): CombatCard[] {
        return _.map(event => event.combatCard, this.log.filter(CombatCardEvent));
    }

    public resources(): Resources {
        const resources = _.map(event => event.resource, this.log.filter(ResourceEvent));
        return new Resources(
            this.countResource(Resource.METAL, resources),
            this.countResource(Resource.FOOD, resources),
            this.countResource(Resource.OIL, resources),
            this.countResource(Resource.WOOD, resources),
        );
    }

    private countResource(type: Resource, resources: Resource[]): number {
        return _.filter(resource => resource === type, resources).length;
    }
}

import * as _ from "ramda";
import {GameMap} from "./GameMap";
import {Field} from "./Field";
import {CombatCardEvent} from "./Events/CombatCardEvent";
import {CombatCard} from "./CombatCard";
import {Event} from "./Events/Event";
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

function sumEvents(payloadFn: (event: Event) => number, events: Event[]) {
    return _.reduce((sum: number, event: Event) => payloadFn(event) + sum, 0, events);
}

export class Player {
    private log: Event[] = [];

    constructor(coins: number = 0, power: number = 0, combatCards: CombatCard[] = []) {
        this.log.push(new CoinEvent(coins));
        this.log.push(new PowerEvent(power));
        combatCards.forEach(combatCard => this.log.push(new CombatCardEvent(combatCard)));

        this.log.push(new MoveEvent(Character.CHARACTER, Field.green));
        this.log.push(new MoveEvent(Worker.WORKER_1, Field.m1));
        this.log.push(new MoveEvent(Worker.WORKER_2, Field.f1));
    }

    public move(unit: Unit, destination: Field) {
        if (!unit.deployed) {
            throw new UnitNotDeployedError(unit);
        }
        let currentLocation = this.unitLocation(unit);
        if (!new GameMap().isReachable(currentLocation, destination)) {
            throw new IllegalMoveError(unit, currentLocation, destination);
        }
        this.log.push(new MoveEvent(unit, destination));
        return this;
    }

    public gainCoins(): Player {
        this.log.push(new CoinEvent(+1));
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
        this.assertValidWorker(worker);

        const workerLocation = this.unitLocation(worker);
        this.log.push(new ResourceEvent(workerLocation, resource1));
        this.log.push(new ResourceEvent(workerLocation, resource2));

        return this;
    }

    public build(worker: Worker, building: Building): Player {
        this.assertValidWorker(worker);
        this.assertBuildingNotAlreadyBuilt(building);

        const location = this.unitLocation(worker);
        this.assertLocationHasNoOtherBuildings(location);

        this.log.push(new BuildEvent(location, building));

        return this;
    }

    public unitLocation(unit: Unit): Field {
        let moves = _.filter(event => event instanceof MoveEvent && event.unit === unit, this.log);
        return moves[moves.length - 1].destination;
    }

    private assertCoins(required: number) {
        let coins = this.coins();
        if (coins < required) {
            throw new NotEnoughCoinsError(1, coins);
        }
    }

    private assertValidWorker(worker: Worker) {
        if (!worker.deployed) {
            throw new UnitNotDeployedError(worker);
        }
    }

    private assertBuildingNotAlreadyBuilt(building: Building) {
        if (!_.none((event: Event) => event instanceof BuildEvent && building === event.building, this.log)) {
            throw new BuildingAlreadyBuildError(building);
        }
    }

    private assertLocationHasNoOtherBuildings(location: Field) {
        if (!_.none((event: Event) => event instanceof BuildEvent && location === event.location, this.log)) {
            throw new LocationAlreadyHasAnotherBuildingError(location);
        }
    }

    private bolster(event: PowerEvent|CombatCardEvent): Player {
        this.assertCoins(1);

        this.log.push(event);
        this.log.push(new CoinEvent(-1));
        return this;
    }

    public power(): number {
        return sumEvents((event: Event) => event instanceof PowerEvent ? event.power : 0, this.log);
    }

    public coins(): number {
        return sumEvents((event: Event) => event instanceof CoinEvent ? event.coins : 0, this.log);
    }

    public combatCards(): CombatCard[] {
        return _.map(event => event.combatCard, _.filter(event => event instanceof CombatCardEvent, this.log));
    }

    public resources(): Resources {
        const resources = _.map(
            event => event.resource,
            _.filter(event => event instanceof ResourceEvent, this.log)
        );
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

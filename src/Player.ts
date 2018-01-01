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

    public unitLocation(unit: Unit): Field {
        let moves = _.filter(event => event instanceof MoveEvent && event.unit === unit, this.log);
        return moves[moves.length - 1].destination;
    }

    private bolster(event: PowerEvent|CombatCardEvent): Player {
        let coins = this.coins();
        if (coins < 1) {
            throw new NotEnoughCoinsError(1, coins);
        }

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
}

import * as _ from "ramda";
import { Availability } from "./Availability";
import { BottomAction } from "./BottomAction";
import { BuildingType } from "./BuildingType";
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
import { Player } from "./Player";
import { RecruitReward } from "./RecruitReward";
import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { Star } from "./Star";
import { TopAction } from "./TopAction";
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
                Availability.assertActionCanBeTaken(this.log, this.players, player, topAction);
                Availability.assertCoins(this.log, player, player.playerMat.topActionCost(topAction));
                return true;
            } catch (error) {
                return false;
            }
        }, Game.TOP_ACTIONS);
    }

    public availableBottomActions(player: Player): BottomAction[] {
        return _.filter((bottomAction: BottomAction): boolean => {
            try {
                Availability.assertActionCanBeTaken(this.log, this.players, player, bottomAction);
                const { resourceType, count } = player.playerMat.bottomActionCost(bottomAction);
                return GameInfo.resources(this.log, player).countByType(resourceType) >= count;
            } catch (error) {
                return false;
            }
        }, Game.BOTTOM_ACTIONS);
    }

    public move(player: Player, unit: Unit, destination: Field) {
        Availability.assertActionCanBeTaken(this.log, this.players, player, TopAction.MOVE);
        Availability.assertUnitDeployed(this.log, player, unit);

        const currentLocation = GameInfo.unitLocation(this.log, player, unit);
        Game.assertLegalMove(currentLocation, destination, unit);

        this.log
            .add(new ActionEvent(player.playerId, TopAction.MOVE))
            .add(new MoveEvent(player.playerId, unit, destination));
        return this.pass(player, TopAction.MOVE);
    }

    public gainCoins(player: Player): Game {
        Availability.assertActionCanBeTaken(this.log, this.players, player, TopAction.MOVE);

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
        Availability.assertActionCanBeTaken(this.log, this.players, player, TopAction.TRADE);
        Availability.assertCoins(this.log, player, 1);
        Availability.assertUnitDeployed(this.log, player, worker);

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
        Availability.assertActionCanBeTaken(this.log, this.players, player, TopAction.TRADE);
        Availability.assertCoins(this.log, player, 1);
        Availability.assertNotMoreThan20Popularity(this.log, player);

        const gainedPopularity = GameInfo.popularity(this.log, player) === Game.MAX_POPULARITY ? 0 : 1;
        this.log
            .add(new ActionEvent(player.playerId, TopAction.TRADE))
            .add(new CoinEvent(player.playerId, -1))
            .add(new PopularityEvent(player.playerId, gainedPopularity));

        return this.pass(player, TopAction.TRADE);
    }

    public produce(player: Player, field1: Field, field2: Field): Game {
        Availability.assertActionCanBeTaken(this.log, this.players, player, TopAction.PRODUCE);
        Availability.assertLocationControlledByPlayer(this.log, player, field1);
        Availability.assertLocationControlledByPlayer(this.log, player, field2);
        if (field1 === field2) {
            throw new IllegalActionError(`Field 1 (${field1}) and Field 2 (${field2}) are the same`);
        }
        const allWorkersCount = GameInfo.allWorkers(this.log, player).length;
        if (allWorkersCount >= Game.PRODUCE_POWER_THRESHOLD) {
            Availability.assertPower(this.log, player, 1);
        }

        if (allWorkersCount >= Game.PRODUCE_POPULARITY_THRESHOLD) {
            Availability.assertPopularity(this.log, player, 1);
        }

        if (allWorkersCount >= Game.PRODUCE_COINS_THRESHOLD) {
            Availability.assertCoins(this.log, player, 1);
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
        Availability.assertActionCanBeTaken(this.log, this.players, player, BottomAction.BUILD);
        Availability.assertUnitDeployed(this.log, player, worker);
        Availability.assertBuildingNotAlreadyBuilt(this.log, player, building);

        const { resourceType, count } = player.playerMat.bottomActionCost(BottomAction.BUILD);
        Availability.assertAvailableResources(this.log, player, resourceType, count, resources);

        const location = GameInfo.unitLocation(this.log, player, worker);
        Availability.assertLocationHasNoOtherBuildings(this.log, player, location);

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
        Availability.assertActionCanBeTaken(this.log, this.players, player, BottomAction.DEPLOY);
        Availability.assertAvailableResources(
            this.log,
            player,
            ResourceType.METAL,
            player.playerMat.bottomActionCost(BottomAction.DEPLOY).count,
            resources,
        );
        Availability.assertUnitNotDeployed(this.log, player, mech);

        const location = GameInfo.unitLocation(this.log, player, worker);
        this.log
            .add(new ActionEvent(player.playerId, BottomAction.DEPLOY))
            .add(new DeployEvent(player.playerId, mech, location));
        return this.pass(player, BottomAction.DEPLOY);
    }

    public enlist(player: Player, bottomAction: BottomAction, recruitReward: RecruitReward, resources: Resource[]) {
        Availability.assertActionCanBeTaken(this.log, this.players, player, BottomAction.ENLIST);
        Availability.assertAvailableResources(
            this.log,
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
        Availability.assertActionCanBeTaken(this.log, this.players, player, BottomAction.UPGRADE);
        Availability.assertAvailableResources(
            this.log,
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
        Availability.assertActionCanBeTaken(this.log, this.players, player, TopAction.BOLSTER);
        Availability.assertCoins(this.log, player, 1);

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
}

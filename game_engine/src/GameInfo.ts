import * as _ from "ramda";
import { Building } from "./Building";
import { CombatCard } from "./CombatCard";
import { BuildEvent } from "./Events/BuildEvent";
import { CoinEvent } from "./Events/CoinEvent";
import { GainCombatCardEvent } from "./Events/CombatCardEvent";
import { DeployEvent } from "./Events/DeployEvent";
import { EnlistEvent } from "./Events/EnlistEvent";
import { Event } from "./Events/Event";
import { EventLog } from "./Events/EventLog";
import { GainResourceEvent } from "./Events/GainResourceEvent";
import { GameEndEvent } from "./Events/GameEndEvent";
import { LocationEvent } from "./Events/LocationEvent";
import { PopularityEvent } from "./Events/PopularityEvent";
import { PowerEvent } from "./Events/PowerEvent";
import { ResourceEvent } from "./Events/ResourceEvent";
import { SpendResourceEvent } from "./Events/SpendResourceEvent";
import { StarEvent } from "./Events/StarEvent";
import { UpgradeEvent } from "./Events/UpgradeEvent";
import { Field } from "./Field";
import { Game } from "./Game";
import { Player } from "./Player";
import { Resource } from "./Resource";
import { Resources } from "./Resources";
import { ResourceType } from "./ResourceType";
import { Star } from "./Star";
import { Mech } from "./Units/Mech";
import { Unit } from "./Units/Unit";
import { Worker } from "./Units/Worker";

export class GameInfo {
    public static score(log: EventLog, players: Player[]): Map<Player, number> {
        const points = new Map();
        players.forEach((player: Player) => {
            const popularity = GameInfo.popularity(log, player);
            const popularityBonus = popularity > 12 ? 2 : popularity > 6 ? 1 : 0;
            points.set(
                player,
                GameInfo.coins(log, player) +
                    GameInfo.stars(log, player).length * (3 + popularityBonus) +
                    GameInfo.territoriesWithoutHomeBase(log, player).length * (2 + popularityBonus) +
                    Math.floor(GameInfo.availableResources(log, player).length / 2) * (1 + popularityBonus),
            );
        });
        return points;
    }

    public static stars(log: EventLog, player: Player): Star[] {
        // @ts-ignore
        return _.pluck("star", log.filterBy(player.playerId, StarEvent));
    }

    public static units(log: EventLog, player: Player): Map<Unit, Field> {
        const unitLocations = new Map<Unit, Field>();
        _.forEach(
            (locationEvent: LocationEvent) => {
                unitLocations.set(locationEvent.unit, locationEvent.destination);
            },
            log.filterBy(player.playerId, LocationEvent) as LocationEvent[],
        );
        return unitLocations;
    }

    public static territories(log: EventLog, player: Player): Field[] {
        return _.uniq(Array.from(GameInfo.units(log, player).values()));
    }

    public static territoriesWithoutHomeBase(log: EventLog, player: Player): Field[] {
        return GameInfo.territories(log, player).filter(Field.isNotHomeBase);
    }

    public static unitLocation(log: EventLog, player: Player, unit: Unit): Field {
        const moves = (log.filterBy(player.playerId, LocationEvent) as LocationEvent[]).filter(
            (event) => event.unit === unit,
        );
        return moves[moves.length - 1].destination;
    }

    public static power(log: EventLog, player: Player): number {
        // @ts-ignore
        return _.sum(_.pluck("power", log.filterBy(player.playerId, PowerEvent)));
    }

    public static coins(log: EventLog, player: Player): number {
        // @ts-ignore
        return _.sum(_.pluck("coins", log.filterBy(player.playerId, CoinEvent)));
    }

    public static combatCards(log: EventLog, player: Player): CombatCard[] {
        // @ts-ignore
        return _.pluck("combatCard", log.filterBy(player.playerId, GainCombatCardEvent));
    }

    public static resources(log: EventLog, player: Player): Resources {
        const availableResources = GameInfo.availableResources(log, player);
        return new Resources(
            GameInfo.resourceByType(ResourceType.METAL, availableResources),
            GameInfo.resourceByType(ResourceType.FOOD, availableResources),
            GameInfo.resourceByType(ResourceType.OIL, availableResources),
            GameInfo.resourceByType(ResourceType.WOOD, availableResources),
        );
    }

    public static buildings(log: EventLog, player: Player): Building[] {
        return _.map(Building.fromEvent, log.filterBy(player.playerId, BuildEvent) as BuildEvent[]);
    }

    public static availableResources(log: EventLog, player: Player): Resource[] {
        const extractResource = (event: ResourceEvent) => event.resources;
        const gained = _.chain(extractResource, log.filter(GainResourceEvent) as GainResourceEvent[]);
        const spent = _.chain(extractResource, log.filter(SpendResourceEvent) as SpendResourceEvent[]);
        for (const spentResource of spent) {
            for (const gainedResource of gained) {
                if (spentResource.location === gainedResource.location && spentResource.type === gainedResource.type) {
                    gained.splice(gained.indexOf(gainedResource), 1);
                    break;
                }
            }
        }
        const territories = GameInfo.territories(log, player);
        return _.filter((resource) => territories.indexOf(resource.location) >= 0, gained);
    }

    public static popularity(log: EventLog, player: Player): number {
        return _.sum(
            _.map((event) => event.popularity, log.filterBy(player.playerId, PopularityEvent) as PopularityEvent[]),
        );
    }

    public static allWorkers(log: EventLog, player: Player): Worker[] {
        return Array.from(GameInfo.units(log, player).keys()).filter((unit: Unit) => unit instanceof Worker);
    }

    public static workersOnLocation(log: EventLog, player: Player, location: Field): number {
        let workerCount = 0;
        for (const [unit, field] of GameInfo.units(log, player).entries()) {
            if (field === location && unit instanceof Worker) {
                workerCount += 1;
            }
        }
        return workerCount;
    }

    public static starCondition(log: EventLog, player: Player, star: Star): boolean {
        switch (star) {
            case Star.ALL_UPGRADES:
                return GameInfo.hasAllUpgrades(log, player);
            case Star.ALL_MECHS:
                return GameInfo.hasAllMechs(log, player);
            case Star.ALL_BUILDINGS:
                return GameInfo.hasAllBuildings(log, player);
            case Star.ALL_RECRUITS:
                return GameInfo.hasAllRecruits(log, player);
            case Star.ALL_WORKERS:
                return GameInfo.hasAllWorkers(log, player);
            case Star.FIRST_OBJECTIVE:
                return false;
            case Star.FIRST_COMBAT_WIN:
                return false;
            case Star.SECOND_COMBAT_WIN:
                return false;
            case Star.MAX_POPULARITY:
                return GameInfo.hasMaxPopularity(log, player);
            case Star.MAX_POWER:
                return GameInfo.hasMaxPower(log, player);
            default:
                return false;
        }
    }

    public static playerOrder(players: Player[]): Player[] {
        return _.sort(
            _.comparator((player1: Player, player2: Player) => {
                return (
                    Player.FACTION_TURN_ORDER.indexOf(player1.faction) <
                    Player.FACTION_TURN_ORDER.indexOf(player2.faction)
                );
            }),
            players,
        );
    }

    public static neighbors(players: Player[], player: Player): Player[] {
        if (players.length === 1) {
            return [];
        }

        const otherPlayers = players.filter((otherPlayer: Player) => player.playerId !== otherPlayer.playerId);

        if (otherPlayers.length < 3) {
            return otherPlayers;
        }

        const playersInPlayOrder = GameInfo.playerOrder(players);
        const playPosition = playersInPlayOrder.indexOf(player);
        if (playPosition === 0) {
            return [playersInPlayOrder[1], playersInPlayOrder[playersInPlayOrder.length - 1]];
        }

        if (playPosition === playersInPlayOrder.length - 1) {
            return [playersInPlayOrder[0], playersInPlayOrder[playersInPlayOrder.length - 2]];
        }

        return [playersInPlayOrder[playPosition - 1], playersInPlayOrder[playPosition + 1]];
    }

    public static gameOver(log: EventLog): boolean {
        return log.lastInstanceOf(GameEndEvent) !== null;
    }

    private static hasMaxPopularity(log: EventLog, player: Player): boolean {
        return GameInfo.popularity(log, player) === 18;
    }

    private static hasMaxPower(log: EventLog, player: Player): boolean {
        return GameInfo.power(log, player) === 16;
    }

    private static hasAllUpgrades(log: EventLog, player: Player): boolean {
        return log.filterBy(player.playerId, UpgradeEvent).length === 6;
    }

    private static hasAllMechs(log: EventLog, player: Player): boolean {
        return (
            log.filterBy(player.playerId, DeployEvent, (event: Event) => (event as DeployEvent).unit instanceof Mech)
                .length === 4
        );
    }

    private static hasAllBuildings(log: EventLog, player: Player): boolean {
        return log.filterBy(player.playerId, BuildEvent).length === 4;
    }

    private static hasAllRecruits(log: EventLog, player: Player): boolean {
        return log.filterBy(player.playerId, EnlistEvent).length === 4;
    }

    private static hasAllWorkers(log: EventLog, player: Player): boolean {
        return GameInfo.allWorkers(log, player).length === 8;
    }

    private static resourceByType(type: ResourceType, resources: Resource[]): number {
        return _.reduce((sum, resource: Resource) => (resource.type === type ? sum + 1 : sum), 0, resources);
    }
}

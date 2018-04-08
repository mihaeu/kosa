"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("ramda");
const BottomAction_1 = require("./BottomAction");
const Building_1 = require("./Building");
const ActionEvent_1 = require("./Events/ActionEvent");
const BuildEvent_1 = require("./Events/BuildEvent");
const CoinEvent_1 = require("./Events/CoinEvent");
const DeployEvent_1 = require("./Events/DeployEvent");
const EnlistEvent_1 = require("./Events/EnlistEvent");
const GainCombatCardEvent_1 = require("./Events/GainCombatCardEvent");
const GainResourceEvent_1 = require("./Events/GainResourceEvent");
const GameEndEvent_1 = require("./Events/GameEndEvent");
const LocationEvent_1 = require("./Events/LocationEvent");
const NewPlayerEvent_1 = require("./Events/NewPlayerEvent");
const PassEvent_1 = require("./Events/PassEvent");
const PopularityEvent_1 = require("./Events/PopularityEvent");
const PowerEvent_1 = require("./Events/PowerEvent");
const SpendResourceEvent_1 = require("./Events/SpendResourceEvent");
const StarEvent_1 = require("./Events/StarEvent");
const UpgradeEvent_1 = require("./Events/UpgradeEvent");
const Field_1 = require("./Field");
const Player_1 = require("./Player");
const Recruit_1 = require("./Recruit");
const Resources_1 = require("./Resources");
const ResourceType_1 = require("./ResourceType");
const Star_1 = require("./Star");
const TopAction_1 = require("./TopAction");
const Mech_1 = require("./Units/Mech");
const Worker_1 = require("./Units/Worker");
const Upgrade_1 = require("./Upgrade");
class GameInfo {
    static players(log) {
        const players = [];
        for (const event of log.log) {
            if (!(event instanceof NewPlayerEvent_1.NewPlayerEvent)) {
                break;
            }
            players.push(event.player);
        }
        return players;
    }
    static score(log, players) {
        const points = new Map();
        players.forEach((player) => {
            const popularity = GameInfo.popularity(log, player);
            const popularityBonus = popularity > 12 ? 2 : popularity > 6 ? 1 : 0;
            points.set(player, GameInfo.coins(log, player) +
                GameInfo.stars(log, player).length * (3 + popularityBonus) +
                GameInfo.territoriesWithoutHomeBase(log, player).length * (2 + popularityBonus) +
                Math.floor(GameInfo.availableResources(log, player).length / 2) * (1 + popularityBonus));
        });
        return points;
    }
    static stars(log, player) {
        // @ts-ignore
        return _.pluck("star", log.filterBy(player.playerId, StarEvent_1.StarEvent));
    }
    static units(log, player) {
        const unitLocations = new Map();
        _.forEach((locationEvent) => {
            unitLocations.set(locationEvent.unit, locationEvent.destination);
        }, log.filterBy(player.playerId, LocationEvent_1.LocationEvent));
        return unitLocations;
    }
    static territories(log, player) {
        return _.uniq(Array.from(GameInfo.units(log, player).values()));
    }
    static territoriesWithoutHomeBase(log, player) {
        return GameInfo.territories(log, player).filter(Field_1.Field.isNotHomeBase);
    }
    static unitLocation(log, player, unit) {
        const moves = log.filterBy(player.playerId, LocationEvent_1.LocationEvent).filter((event) => event.unit === unit);
        return moves[moves.length - 1].destination;
    }
    static power(log, player) {
        // @ts-ignore
        return _.sum(_.pluck("power", log.filterBy(player.playerId, PowerEvent_1.PowerEvent)));
    }
    static coins(log, player) {
        // @ts-ignore
        return _.sum(_.pluck("coins", log.filterBy(player.playerId, CoinEvent_1.CoinEvent)));
    }
    static combatCards(log, player) {
        // @ts-ignore
        return _.pluck("combatCard", log.filterBy(player.playerId, GainCombatCardEvent_1.GainCombatCardEvent));
    }
    static resources(log, player) {
        const availableResources = GameInfo.availableResources(log, player);
        return new Resources_1.Resources(GameInfo.resourceByType(ResourceType_1.ResourceType.METAL, availableResources), GameInfo.resourceByType(ResourceType_1.ResourceType.FOOD, availableResources), GameInfo.resourceByType(ResourceType_1.ResourceType.OIL, availableResources), GameInfo.resourceByType(ResourceType_1.ResourceType.WOOD, availableResources));
    }
    static upgrades(log, player) {
        return _.map((event) => {
            return new Upgrade_1.Upgrade(event.topAction, event.bottomAction);
        }, log.filterBy(player.playerId, UpgradeEvent_1.UpgradeEvent));
    }
    static recruits(log, player) {
        return _.map((event) => {
            return new Recruit_1.Recruit(event.recruitReward, event.bottomAction);
        }, log.filterBy(player.playerId, EnlistEvent_1.EnlistEvent));
    }
    static buildings(log, player) {
        return _.map(Building_1.Building.fromEvent, log.filterBy(player.playerId, BuildEvent_1.BuildEvent));
    }
    static availableResources(log, player) {
        const territories = GameInfo.territories(log, player);
        return _.filter((resource) => territories.indexOf(resource.location) >= 0, GameInfo.allResources(log));
    }
    static allResources(log) {
        const extractResource = (event) => event.resources;
        const gained = _.chain(extractResource, log.filter(GainResourceEvent_1.GainResourceEvent));
        const spent = _.chain(extractResource, log.filter(SpendResourceEvent_1.SpendResourceEvent));
        for (const spentResource of spent) {
            for (const gainedResource of gained) {
                if (spentResource.location === gainedResource.location && spentResource.type === gainedResource.type) {
                    gained.splice(gained.indexOf(gainedResource), 1);
                    break;
                }
            }
        }
        return gained;
    }
    static popularity(log, player) {
        return _.sum(_.map((event) => event.popularity, log.filterBy(player.playerId, PopularityEvent_1.PopularityEvent)));
    }
    static allWorkers(log, player) {
        return Array.from(GameInfo.units(log, player).keys()).filter((unit) => unit instanceof Worker_1.Worker);
    }
    static workersOnLocation(log, player, location) {
        let workerCount = 0;
        for (const [unit, field] of GameInfo.units(log, player).entries()) {
            if (field === location && unit instanceof Worker_1.Worker) {
                workerCount += 1;
            }
        }
        return workerCount;
    }
    static starCondition(log, player, star) {
        switch (star) {
            case Star_1.Star.ALL_UPGRADES:
                return GameInfo.hasAllUpgrades(log, player);
            case Star_1.Star.ALL_MECHS:
                return GameInfo.hasAllMechs(log, player);
            case Star_1.Star.ALL_BUILDINGS:
                return GameInfo.hasAllBuildings(log, player);
            case Star_1.Star.ALL_RECRUITS:
                return GameInfo.hasAllRecruits(log, player);
            case Star_1.Star.ALL_WORKERS:
                return GameInfo.hasAllWorkers(log, player);
            case Star_1.Star.FIRST_OBJECTIVE:
                return false;
            case Star_1.Star.FIRST_COMBAT_WIN:
                return false;
            case Star_1.Star.SECOND_COMBAT_WIN:
                return false;
            case Star_1.Star.MAX_POPULARITY:
                return GameInfo.hasMaxPopularity(log, player);
            case Star_1.Star.MAX_POWER:
                return GameInfo.hasMaxPower(log, player);
            default:
                return false;
        }
    }
    static playerOrder(players) {
        return _.sort(_.comparator((player1, player2) => {
            return (Player_1.Player.FACTION_TURN_ORDER.indexOf(player1.faction) <
                Player_1.Player.FACTION_TURN_ORDER.indexOf(player2.faction));
        }), players);
    }
    static neighbors(players, player) {
        if (players.length === 1) {
            return [];
        }
        const otherPlayers = players.filter((otherPlayer) => player.playerId !== otherPlayer.playerId);
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
    static gameOver(log) {
        return log.lastInstanceOf(GameEndEvent_1.GameEndEvent) !== null;
    }
    static isFirstActionThisTurn(log, player) {
        return log.lastOfTwo(player.playerId, ActionEvent_1.ActionEvent, PassEvent_1.PassEvent) instanceof PassEvent_1.PassEvent;
    }
    static gameJustStarted(log) {
        return log.lastInstanceOf(ActionEvent_1.ActionEvent) === null;
    }
    static lastActionFor(log, player) {
        const lastActionEvent = log.lastInstanceOf(ActionEvent_1.ActionEvent, (event) => event.playerId === player.playerId);
        return lastActionEvent !== null ? lastActionEvent.action : null;
    }
    static playerIsFirstPlayer(players, currentPlayer) {
        for (const otherPlayer of players) {
            if (otherPlayer.playerMat.startPosition < currentPlayer.playerMat.startPosition) {
                return false;
            }
        }
        return true;
    }
    static lastPlayer(log, players) {
        const lastActionEvent = log.lastInstanceOf(ActionEvent_1.ActionEvent, () => true);
        if (lastActionEvent === null) {
            return null;
        }
        for (const player of players) {
            if (player.playerId === lastActionEvent.playerId) {
                return player;
            }
        }
        return null;
    }
    static playerIsNext(log, players, player, action) {
        const lastPlayer = GameInfo.lastPlayer(log, players);
        if (lastPlayer === null) {
            return true;
        }
        const playerOrder = GameInfo.playerOrder(players);
        if (playerOrder.lastIndexOf(lastPlayer) === playerOrder.length - 1 && playerOrder.indexOf(player) === 0) {
            return true;
        }
        return (GameInfo.playerPlaysBottomActionAfterTopAction(lastPlayer, playerOrder, player, action) ||
            lastPlayer === playerOrder[playerOrder.indexOf(player) - 1]);
    }
    static actionFromTheSameColumn(currentAction, lastAction, player) {
        return (currentAction === lastAction ||
            (lastAction in TopAction_1.TopAction &&
                currentAction in BottomAction_1.BottomAction &&
                player.playerMat.topActionMatchesBottomAction(lastAction, currentAction)) ||
            (lastAction in BottomAction_1.BottomAction &&
                currentAction in TopAction_1.TopAction &&
                player.playerMat.topActionMatchesBottomAction(currentAction, lastAction)));
    }
    static hasMaxPopularity(log, player) {
        return GameInfo.popularity(log, player) === 18;
    }
    static hasMaxPower(log, player) {
        return GameInfo.power(log, player) === 16;
    }
    static hasAllUpgrades(log, player) {
        return log.filterBy(player.playerId, UpgradeEvent_1.UpgradeEvent).length === 6;
    }
    static hasAllMechs(log, player) {
        return (log.filterBy(player.playerId, DeployEvent_1.DeployEvent, (event) => event.unit instanceof Mech_1.Mech)
            .length === 4);
    }
    static hasAllBuildings(log, player) {
        return log.filterBy(player.playerId, BuildEvent_1.BuildEvent).length === 4;
    }
    static hasAllRecruits(log, player) {
        return log.filterBy(player.playerId, EnlistEvent_1.EnlistEvent).length === 4;
    }
    static hasAllWorkers(log, player) {
        return GameInfo.allWorkers(log, player).length === 8;
    }
    static resourceByType(type, resources) {
        return _.reduce((sum, resource) => (resource.type === type ? sum + 1 : sum), 0, resources);
    }
    static playerPlaysBottomActionAfterTopAction(lastPlayer, playerOrder, player, action) {
        return lastPlayer === playerOrder[playerOrder.indexOf(player)] && action in BottomAction_1.BottomAction;
    }
}
exports.GameInfo = GameInfo;

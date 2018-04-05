"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BottomAction_1 = require("./BottomAction");
const CoinEvent_1 = require("./Events/CoinEvent");
const PopularityEvent_1 = require("./Events/PopularityEvent");
const ResourceCost_1 = require("./ResourceCost");
const ResourceType_1 = require("./ResourceType");
const TopAction_1 = require("./TopAction");
class PlayerMat {
    constructor(startPosition, // the actual game uses 1, 2, 2a, 3, 3a, 4, 5
    setupEvents = [], actionMap, bottomActionBaseCost, bottomActionReward, topActionBaseCost = PlayerMat.topActionBaseCost()) {
        this.startPosition = startPosition;
        this.setupEvents = setupEvents;
        this.actionMap = actionMap;
        this.bottomActionBaseCost = bottomActionBaseCost;
        this.bottomActionReward = bottomActionReward;
        this.topActionBaseCost = topActionBaseCost;
    }
    static createFromString(playerMat, playerId) {
        switch (playerMat) {
            case "engineering":
                return PlayerMat.engineering(playerId);
            case "agricultural":
                return PlayerMat.agricultural(playerId);
            case "industrial":
                return PlayerMat.industrial(playerId);
            case "mechanical":
                return PlayerMat.mechanical(playerId);
            case "patriotic":
                return PlayerMat.patriotic(playerId);
            case "innovative":
                return PlayerMat.innovative(playerId);
            case "militant":
            default:
                return PlayerMat.militant(playerId);
        }
    }
    static engineering(playerId) {
        const actionMap = new Map();
        actionMap.set(TopAction_1.TopAction.PRODUCE, BottomAction_1.BottomAction.UPGRADE);
        actionMap.set(TopAction_1.TopAction.TRADE, BottomAction_1.BottomAction.DEPLOY);
        actionMap.set(TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.BUILD);
        actionMap.set(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.ENLIST);
        const bottomActionBaseCosts = new Map();
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.UPGRADE, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.DEPLOY, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.METAL, 4));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.BUILD, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.WOOD, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.ENLIST, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.FOOD, 3));
        return new PlayerMat(2, [new PopularityEvent_1.PopularityEvent(playerId, 2), new CoinEvent_1.CoinEvent(playerId, 5)], actionMap, bottomActionBaseCosts, this.defaultRewards()
            .set(BottomAction_1.BottomAction.UPGRADE, 1)
            .set(BottomAction_1.BottomAction.BUILD, 2)
            .set(BottomAction_1.BottomAction.ENLIST, 3));
    }
    static agricultural(playerId) {
        const actionMap = new Map();
        actionMap.set(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.UPGRADE);
        actionMap.set(TopAction_1.TopAction.TRADE, BottomAction_1.BottomAction.DEPLOY);
        actionMap.set(TopAction_1.TopAction.PRODUCE, BottomAction_1.BottomAction.BUILD);
        actionMap.set(TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.ENLIST);
        const bottomActionBaseCosts = new Map();
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.UPGRADE, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.OIL, 2));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.DEPLOY, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.METAL, 4));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.BUILD, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.WOOD, 4));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.ENLIST, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.FOOD, 3));
        return new PlayerMat(7, [new PopularityEvent_1.PopularityEvent(playerId, 4), new CoinEvent_1.CoinEvent(playerId, 7)], actionMap, bottomActionBaseCosts, this.defaultRewards()
            .set(BottomAction_1.BottomAction.UPGRADE, 2)
            .set(BottomAction_1.BottomAction.BUILD, 3)
            .set(BottomAction_1.BottomAction.ENLIST, 1));
    }
    static industrial(playerId) {
        const actionMap = new Map();
        actionMap.set(TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.UPGRADE);
        actionMap.set(TopAction_1.TopAction.PRODUCE, BottomAction_1.BottomAction.DEPLOY);
        actionMap.set(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.BUILD);
        actionMap.set(TopAction_1.TopAction.TRADE, BottomAction_1.BottomAction.ENLIST);
        const bottomActionBaseCosts = new Map();
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.UPGRADE, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.DEPLOY, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.METAL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.BUILD, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.WOOD, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.ENLIST, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.FOOD, 4));
        return new PlayerMat(1, [new PopularityEvent_1.PopularityEvent(playerId, 2), new CoinEvent_1.CoinEvent(playerId, 4)], actionMap, bottomActionBaseCosts, this.defaultRewards()
            .set(BottomAction_1.BottomAction.UPGRADE, 3)
            .set(BottomAction_1.BottomAction.DEPLOY, 2)
            .set(BottomAction_1.BottomAction.BUILD, 1));
    }
    static mechanical(playerId) {
        const actionMap = new Map();
        actionMap.set(TopAction_1.TopAction.TRADE, BottomAction_1.BottomAction.UPGRADE);
        actionMap.set(TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.DEPLOY);
        actionMap.set(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.BUILD);
        actionMap.set(TopAction_1.TopAction.PRODUCE, BottomAction_1.BottomAction.ENLIST);
        const bottomActionBaseCosts = new Map();
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.UPGRADE, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.DEPLOY, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.METAL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.BUILD, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.WOOD, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.ENLIST, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.FOOD, 4));
        return new PlayerMat(6, [new PopularityEvent_1.PopularityEvent(playerId, 3), new CoinEvent_1.CoinEvent(playerId, 6)], actionMap, bottomActionBaseCosts, this.defaultRewards()
            .set(BottomAction_1.BottomAction.DEPLOY, 2)
            .set(BottomAction_1.BottomAction.BUILD, 2)
            .set(BottomAction_1.BottomAction.ENLIST, 2));
    }
    static patriotic(playerId) {
        const actionMap = new Map();
        actionMap.set(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.UPGRADE);
        actionMap.set(TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.DEPLOY);
        actionMap.set(TopAction_1.TopAction.TRADE, BottomAction_1.BottomAction.BUILD);
        actionMap.set(TopAction_1.TopAction.PRODUCE, BottomAction_1.BottomAction.ENLIST);
        const bottomActionBaseCosts = new Map();
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.UPGRADE, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.OIL, 2));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.DEPLOY, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.METAL, 4));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.BUILD, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.WOOD, 4));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.ENLIST, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.FOOD, 3));
        return new PlayerMat(4, [new PopularityEvent_1.PopularityEvent(playerId, 2), new CoinEvent_1.CoinEvent(playerId, 6)], actionMap, bottomActionBaseCosts, this.defaultRewards()
            .set(BottomAction_1.BottomAction.UPGRADE, 1)
            .set(BottomAction_1.BottomAction.DEPLOY, 3)
            .set(BottomAction_1.BottomAction.ENLIST, 2));
    }
    static innovative(playerId) {
        const actionMap = new Map();
        actionMap.set(TopAction_1.TopAction.TRADE, BottomAction_1.BottomAction.UPGRADE);
        actionMap.set(TopAction_1.TopAction.PRODUCE, BottomAction_1.BottomAction.DEPLOY);
        actionMap.set(TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.BUILD);
        actionMap.set(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.ENLIST);
        const bottomActionBaseCosts = new Map();
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.UPGRADE, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.DEPLOY, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.METAL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.BUILD, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.WOOD, 4));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.ENLIST, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.FOOD, 3));
        return new PlayerMat(5, [new PopularityEvent_1.PopularityEvent(playerId, 3), new CoinEvent_1.CoinEvent(playerId, 5)], actionMap, bottomActionBaseCosts, this.defaultRewards()
            .set(BottomAction_1.BottomAction.UPGRADE, 3)
            .set(BottomAction_1.BottomAction.DEPLOY, 1)
            .set(BottomAction_1.BottomAction.BUILD, 2));
    }
    /** @TODO: check name */
    static militant(playerId) {
        const actionMap = new Map();
        actionMap.set(TopAction_1.TopAction.BOLSTER, BottomAction_1.BottomAction.UPGRADE);
        actionMap.set(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.DEPLOY);
        actionMap.set(TopAction_1.TopAction.PRODUCE, BottomAction_1.BottomAction.BUILD);
        actionMap.set(TopAction_1.TopAction.TRADE, BottomAction_1.BottomAction.ENLIST);
        const bottomActionBaseCosts = new Map();
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.UPGRADE, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.DEPLOY, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.METAL, 3));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.BUILD, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.WOOD, 4));
        bottomActionBaseCosts.set(BottomAction_1.BottomAction.ENLIST, new ResourceCost_1.ResourceCost(ResourceType_1.ResourceType.FOOD, 3));
        return new PlayerMat(3, [new PopularityEvent_1.PopularityEvent(playerId, 3), new CoinEvent_1.CoinEvent(playerId, 4)], actionMap, bottomActionBaseCosts, this.defaultRewards()
            .set(BottomAction_1.BottomAction.DEPLOY, 3)
            .set(BottomAction_1.BottomAction.BUILD, 1)
            .set(BottomAction_1.BottomAction.ENLIST, 2));
    }
    static topActionBaseCost() {
        const topActionBaseCost = new Map();
        topActionBaseCost.set(TopAction_1.TopAction.MOVE, 0);
        topActionBaseCost.set(TopAction_1.TopAction.BOLSTER, 1);
        topActionBaseCost.set(TopAction_1.TopAction.TRADE, 1);
        topActionBaseCost.set(TopAction_1.TopAction.PRODUCE, 0);
        return topActionBaseCost;
    }
    static defaultRewards() {
        return new Map()
            .set(BottomAction_1.BottomAction.BUILD, 0)
            .set(BottomAction_1.BottomAction.UPGRADE, 0)
            .set(BottomAction_1.BottomAction.ENLIST, 0)
            .set(BottomAction_1.BottomAction.DEPLOY, 0);
    }
    topActionMatchesBottomAction(thisAction, thatAction) {
        if (thisAction in TopAction_1.TopAction && thatAction in BottomAction_1.BottomAction) {
            return this.actionMap.get(thisAction) === thatAction;
        }
        if (thisAction in BottomAction_1.BottomAction && thatAction in TopAction_1.TopAction) {
            return this.actionMap.get(thatAction) === thisAction;
        }
        return false;
    }
    topActionCost(topAction) {
        // @ts-ignore
        return this.topActionBaseCost.get(topAction);
    }
    bottomActionCost(bottomAction) {
        // @ts-ignore
        return this.bottomActionBaseCost.get(bottomAction);
    }
    bottomReward(bottomAction) {
        // @ts-ignore
        return this.bottomActionReward.get(bottomAction);
    }
}
exports.PlayerMat = PlayerMat;

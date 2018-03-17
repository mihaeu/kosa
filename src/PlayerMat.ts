import {PopularityEvent} from "./Events/PopularityEvent";
import {CoinEvent} from "./Events/CoinEvent";
import {Event} from "./Events/Event";
import {TopAction} from "./TopAction";
import {BottomAction} from "./BottomAction";
import {PlayerId} from "./PlayerId";

export class PlayerMat {
    private constructor(public readonly setupEvents: Event[] = [], private readonly actionMap: {}) {}

    public topActionMatchesBottomAction(topAction: TopAction, bottomAction: BottomAction): boolean {
        return this.actionMap[topAction] === bottomAction;
    }

    public static agricultural(playerId: PlayerId): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.DEPLOY;
        actionMap[TopAction.BOLSTER] = BottomAction.ENLIST;
        actionMap[TopAction.MOVE] = BottomAction.UPGRADE;
        actionMap[TopAction.PRODUCE] = BottomAction.BUILD;

        return new PlayerMat([
            new PopularityEvent(playerId, 4),
            new CoinEvent(playerId, 7),
        ], actionMap);
    }

    public static engineering(playerId: PlayerId): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.DEPLOY;
        actionMap[TopAction.BOLSTER] = BottomAction.BUILD;
        actionMap[TopAction.MOVE] = BottomAction.ENLIST;
        actionMap[TopAction.PRODUCE] = BottomAction.UPGRADE;

        return new PlayerMat([
            new PopularityEvent(playerId, 2),
            new CoinEvent(playerId, 5),
        ], actionMap);
    }

    public static industrial(playerId: PlayerId): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.ENLIST;
        actionMap[TopAction.BOLSTER] = BottomAction.UPGRADE;
        actionMap[TopAction.MOVE] = BottomAction.BUILD;
        actionMap[TopAction.PRODUCE] = BottomAction.DEPLOY;

        return new PlayerMat([
            new PopularityEvent(playerId, 2),
            new CoinEvent(playerId, 4),
        ], actionMap);
    }

    public static mechanical(playerId: PlayerId): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.UPGRADE;
        actionMap[TopAction.BOLSTER] = BottomAction.DEPLOY;
        actionMap[TopAction.MOVE] = BottomAction.BUILD;
        actionMap[TopAction.PRODUCE] = BottomAction.ENLIST;

        return new PlayerMat([
            new PopularityEvent(playerId, 3),
            new CoinEvent(playerId, 6),
        ], actionMap);
    }

    public static patriotic(playerId: PlayerId): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.BUILD;
        actionMap[TopAction.BOLSTER] = BottomAction.DEPLOY;
        actionMap[TopAction.MOVE] = BottomAction.UPGRADE;
        actionMap[TopAction.PRODUCE] = BottomAction.ENLIST;

        return new PlayerMat([
            new PopularityEvent(playerId, 2),
            new CoinEvent(playerId, 6),
        ], actionMap);
    }

    public static innovative(playerId: PlayerId): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.UPGRADE;
        actionMap[TopAction.BOLSTER] = BottomAction.BUILD;
        actionMap[TopAction.MOVE] = BottomAction.ENLIST;
        actionMap[TopAction.PRODUCE] = BottomAction.DEPLOY;

        return new PlayerMat([
            new PopularityEvent(playerId, 3),
            new CoinEvent(playerId, 5),
        ], actionMap);
    }

    /** @TODO: check name */
    public static militant(playerId: PlayerId): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.ENLIST;
        actionMap[TopAction.BOLSTER] = BottomAction.UPGRADE;
        actionMap[TopAction.MOVE] = BottomAction.DEPLOY;
        actionMap[TopAction.PRODUCE] = BottomAction.BUILD;

        return new PlayerMat([
            new PopularityEvent(playerId, 3),
            new CoinEvent(playerId, 4),
        ], actionMap);
    }
}
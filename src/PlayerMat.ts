import {PopularityEvent} from "./Events/PopularityEvent";
import {CoinEvent} from "./Events/CoinEvent";
import {Event} from "./Events/Event";
import {TopAction} from "./TopAction";
import {BottomAction} from "./BottomAction";
import {PlayerId} from "./PlayerId";

export class PlayerMat {
    private constructor(
        public readonly startPosition: 1|2|3|4|5|6|7, // the actual game uses 1, 2, 2a, 3, 3a, 4, 5
        public readonly setupEvents: Event[] = [],
        private readonly actionMap: Map<TopAction, BottomAction>
    ) {}

    public topActionMatchesBottomAction(
        thisAction: TopAction | BottomAction,
        thatAction: TopAction | BottomAction
    ): boolean {
        if (thisAction in TopAction && thatAction in BottomAction) {
            return this.actionMap.get(thisAction as TopAction) === thatAction
        }

        if (thisAction in BottomAction && thatAction in TopAction) {
            return this.actionMap.get(thatAction as TopAction) === thisAction
        }

        return false;
    }

    public static agricultural(playerId: PlayerId): PlayerMat {
        let actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.DEPLOY);
        actionMap.set(TopAction.BOLSTER, BottomAction.ENLIST);
        actionMap.set(TopAction.MOVE, BottomAction.UPGRADE);
        actionMap.set(TopAction.PRODUCE, BottomAction.BUILD);

        return new PlayerMat(
            7,
            [
                new PopularityEvent(playerId, 4),
                new CoinEvent(playerId, 7),
            ],
            actionMap
        );
    }

    public static engineering(playerId: PlayerId): PlayerMat {
        let actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.DEPLOY);
        actionMap.set(TopAction.BOLSTER, BottomAction.BUILD);
        actionMap.set(TopAction.MOVE, BottomAction.ENLIST);
        actionMap.set(TopAction.PRODUCE, BottomAction.UPGRADE);

        return new PlayerMat(
            2,
            [
                new PopularityEvent(playerId, 2),
                new CoinEvent(playerId, 5),
            ],
            actionMap
        );
    }

    public static industrial(playerId: PlayerId): PlayerMat {
        let actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.ENLIST);
        actionMap.set(TopAction.BOLSTER, BottomAction.UPGRADE);
        actionMap.set(TopAction.MOVE, BottomAction.BUILD);
        actionMap.set(TopAction.PRODUCE, BottomAction.DEPLOY);

        return new PlayerMat(
            1,
            [
                new PopularityEvent(playerId, 2),
                new CoinEvent(playerId, 4),
            ],
            actionMap
        );
    }

    public static mechanical(playerId: PlayerId): PlayerMat {
        let actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.UPGRADE);
        actionMap.set(TopAction.BOLSTER, BottomAction.DEPLOY);
        actionMap.set(TopAction.MOVE, BottomAction.BUILD);
        actionMap.set(TopAction.PRODUCE, BottomAction.ENLIST);

        return new PlayerMat(
            6,
            [
                new PopularityEvent(playerId, 3),
                new CoinEvent(playerId, 6),
            ],
            actionMap
        );
    }

    public static patriotic(playerId: PlayerId): PlayerMat {
        let actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.BUILD);
        actionMap.set(TopAction.BOLSTER, BottomAction.DEPLOY);
        actionMap.set(TopAction.MOVE, BottomAction.UPGRADE);
        actionMap.set(TopAction.PRODUCE, BottomAction.ENLIST);

        return new PlayerMat(
            4,
            [
                new PopularityEvent(playerId, 2),
                new CoinEvent(playerId, 6),
            ],
            actionMap
        );
    }

    public static innovative(playerId: PlayerId): PlayerMat {
        let actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.UPGRADE);
        actionMap.set(TopAction.BOLSTER, BottomAction.BUILD);
        actionMap.set(TopAction.MOVE, BottomAction.ENLIST);
        actionMap.set(TopAction.PRODUCE, BottomAction.DEPLOY);

        return new PlayerMat(
            5,
            [
                new PopularityEvent(playerId, 3),
                new CoinEvent(playerId, 5),
            ],
            actionMap
        );
    }

    /** @TODO: check name */
    public static militant(playerId: PlayerId): PlayerMat {
        let actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.ENLIST);
        actionMap.set(TopAction.BOLSTER, BottomAction.UPGRADE);
        actionMap.set(TopAction.MOVE, BottomAction.DEPLOY);
        actionMap.set(TopAction.PRODUCE, BottomAction.BUILD);

        return new PlayerMat(
            3,
            [
                new PopularityEvent(playerId, 3),
                new CoinEvent(playerId, 4),
            ],
            actionMap
        );
    }
}
import {PopularityEvent} from "./Events/PopularityEvent";
import {CoinEvent} from "./Events/CoinEvent";
import {Event} from "./Events/Event";
import {TopAction} from "./TopAction";
import {BottomAction} from "./BottomAction";

export class PlayerMat {
    private constructor(public readonly setupEvents: Event[] = [], private readonly actionMap: {}) {}

    public topActionMatchesBottomAction(topAction: TopAction, bottomAction: BottomAction): boolean {
        return this.actionMap[topAction] === bottomAction;
    }

    public static agricultural(): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.DEPLOY;
        actionMap[TopAction.BOLSTER] = BottomAction.ENLIST;
        actionMap[TopAction.MOVE] = BottomAction.UPGRADE;
        actionMap[TopAction.PRODUCE] = BottomAction.BUILD;
        return new PlayerMat([
            new PopularityEvent(4),
            new CoinEvent(7),
        ], actionMap);
    }

    public static engineering(): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.DEPLOY;
        actionMap[TopAction.BOLSTER] = BottomAction.BUILD;
        actionMap[TopAction.MOVE] = BottomAction.ENLIST;
        actionMap[TopAction.PRODUCE] = BottomAction.UPGRADE;
        return new PlayerMat([
            new PopularityEvent(2),
            new CoinEvent(5),
        ], actionMap);
    }

    public static industrial(): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.ENLIST;
        actionMap[TopAction.BOLSTER] = BottomAction.UPGRADE;
        actionMap[TopAction.MOVE] = BottomAction.BUILD;
        actionMap[TopAction.PRODUCE] = BottomAction.DEPLOY;
        return new PlayerMat([
            new PopularityEvent(2),
            new CoinEvent(4),
        ], actionMap);
    }

    public static mechanical(): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.UPGRADE;
        actionMap[TopAction.BOLSTER] = BottomAction.DEPLOY;
        actionMap[TopAction.MOVE] = BottomAction.BUILD;
        actionMap[TopAction.PRODUCE] = BottomAction.ENLIST;
        return new PlayerMat([
            new PopularityEvent(3),
            new CoinEvent(6),
        ], actionMap);
    }

    public static patriotic(): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.BUILD;
        actionMap[TopAction.BOLSTER] = BottomAction.DEPLOY;
        actionMap[TopAction.MOVE] = BottomAction.UPGRADE;
        actionMap[TopAction.PRODUCE] = BottomAction.ENLIST;
        return new PlayerMat([
            new PopularityEvent(2),
            new CoinEvent(6),
        ], actionMap);
    }

    public static innovative(): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.UPGRADE;
        actionMap[TopAction.BOLSTER] = BottomAction.BUILD;
        actionMap[TopAction.MOVE] = BottomAction.ENLIST;
        actionMap[TopAction.PRODUCE] = BottomAction.DEPLOY;
        return new PlayerMat([
            new PopularityEvent(3),
            new CoinEvent(5),
        ], actionMap);
    }

    /** @TODO: check name */
    public static militant(): PlayerMat {
        let actionMap = {};
        actionMap[TopAction.TRADE] = BottomAction.ENLIST;
        actionMap[TopAction.BOLSTER] = BottomAction.UPGRADE;
        actionMap[TopAction.MOVE] = BottomAction.DEPLOY;
        actionMap[TopAction.PRODUCE] = BottomAction.BUILD;
        return new PlayerMat([
            new PopularityEvent(3),
            new CoinEvent(4),
        ], actionMap);
    }
}
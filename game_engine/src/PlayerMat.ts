import { BottomAction } from "./BottomAction";
import { CoinEvent } from "./Events/CoinEvent";
import { Event } from "./Events/Event";
import { PopularityEvent } from "./Events/PopularityEvent";
import { PlayerId } from "./PlayerId";
import { ResourceCost } from "./ResourceCost";
import { ResourceType } from "./ResourceType";
import { TopAction } from "./TopAction";

export class PlayerMat {
    public static engineering(playerId: PlayerId): PlayerMat {
        const actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.PRODUCE, BottomAction.UPGRADE);
        actionMap.set(TopAction.TRADE, BottomAction.DEPLOY);
        actionMap.set(TopAction.BOLSTER, BottomAction.BUILD);
        actionMap.set(TopAction.MOVE, BottomAction.ENLIST);

        const bottomActionBaseCosts = new Map<BottomAction, ResourceCost>();
        bottomActionBaseCosts.set(BottomAction.UPGRADE, new ResourceCost(ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction.DEPLOY, new ResourceCost(ResourceType.METAL, 4));
        bottomActionBaseCosts.set(BottomAction.BUILD, new ResourceCost(ResourceType.WOOD, 3));
        bottomActionBaseCosts.set(BottomAction.ENLIST, new ResourceCost(ResourceType.FOOD, 3));

        return new PlayerMat(
            2,
            [new PopularityEvent(playerId, 2), new CoinEvent(playerId, 5)],
            actionMap,
            bottomActionBaseCosts,
            this.defaultRewards()
                .set(BottomAction.UPGRADE, 1)
                .set(BottomAction.BUILD, 2)
                .set(BottomAction.ENLIST, 3),
        );
    }

    public static agricultural(playerId: PlayerId): PlayerMat {
        const actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.MOVE, BottomAction.UPGRADE);
        actionMap.set(TopAction.TRADE, BottomAction.DEPLOY);
        actionMap.set(TopAction.PRODUCE, BottomAction.BUILD);
        actionMap.set(TopAction.BOLSTER, BottomAction.ENLIST);

        const bottomActionBaseCosts = new Map<BottomAction, ResourceCost>();
        bottomActionBaseCosts.set(BottomAction.UPGRADE, new ResourceCost(ResourceType.OIL, 2));
        bottomActionBaseCosts.set(BottomAction.DEPLOY, new ResourceCost(ResourceType.METAL, 4));
        bottomActionBaseCosts.set(BottomAction.BUILD, new ResourceCost(ResourceType.WOOD, 4));
        bottomActionBaseCosts.set(BottomAction.ENLIST, new ResourceCost(ResourceType.FOOD, 3));

        return new PlayerMat(
            7,
            [new PopularityEvent(playerId, 4), new CoinEvent(playerId, 7)],
            actionMap,
            bottomActionBaseCosts,
            this.defaultRewards()
                .set(BottomAction.UPGRADE, 2)
                .set(BottomAction.BUILD, 3)
                .set(BottomAction.ENLIST, 1),
        );
    }

    public static industrial(playerId: PlayerId): PlayerMat {
        const actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.BOLSTER, BottomAction.UPGRADE);
        actionMap.set(TopAction.PRODUCE, BottomAction.DEPLOY);
        actionMap.set(TopAction.MOVE, BottomAction.BUILD);
        actionMap.set(TopAction.TRADE, BottomAction.ENLIST);

        const bottomActionBaseCosts = new Map<BottomAction, ResourceCost>();
        bottomActionBaseCosts.set(BottomAction.UPGRADE, new ResourceCost(ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction.DEPLOY, new ResourceCost(ResourceType.METAL, 3));
        bottomActionBaseCosts.set(BottomAction.BUILD, new ResourceCost(ResourceType.WOOD, 3));
        bottomActionBaseCosts.set(BottomAction.ENLIST, new ResourceCost(ResourceType.FOOD, 4));

        return new PlayerMat(
            1,
            [new PopularityEvent(playerId, 2), new CoinEvent(playerId, 4)],
            actionMap,
            bottomActionBaseCosts,
            this.defaultRewards()
                .set(BottomAction.UPGRADE, 3)
                .set(BottomAction.DEPLOY, 2)
                .set(BottomAction.BUILD, 1),
        );
    }

    public static mechanical(playerId: PlayerId): PlayerMat {
        const actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.UPGRADE);
        actionMap.set(TopAction.BOLSTER, BottomAction.DEPLOY);
        actionMap.set(TopAction.MOVE, BottomAction.BUILD);
        actionMap.set(TopAction.PRODUCE, BottomAction.ENLIST);

        const bottomActionBaseCosts = new Map<BottomAction, ResourceCost>();
        bottomActionBaseCosts.set(BottomAction.UPGRADE, new ResourceCost(ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction.DEPLOY, new ResourceCost(ResourceType.METAL, 3));
        bottomActionBaseCosts.set(BottomAction.BUILD, new ResourceCost(ResourceType.WOOD, 3));
        bottomActionBaseCosts.set(BottomAction.ENLIST, new ResourceCost(ResourceType.FOOD, 4));

        return new PlayerMat(
            6,
            [new PopularityEvent(playerId, 3), new CoinEvent(playerId, 6)],
            actionMap,
            bottomActionBaseCosts,
            this.defaultRewards()
                .set(BottomAction.DEPLOY, 2)
                .set(BottomAction.BUILD, 2)
                .set(BottomAction.ENLIST, 2),
        );
    }

    public static patriotic(playerId: PlayerId): PlayerMat {
        const actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.MOVE, BottomAction.UPGRADE);
        actionMap.set(TopAction.BOLSTER, BottomAction.DEPLOY);
        actionMap.set(TopAction.TRADE, BottomAction.BUILD);
        actionMap.set(TopAction.PRODUCE, BottomAction.ENLIST);

        const bottomActionBaseCosts = new Map<BottomAction, ResourceCost>();
        bottomActionBaseCosts.set(BottomAction.UPGRADE, new ResourceCost(ResourceType.OIL, 2));
        bottomActionBaseCosts.set(BottomAction.DEPLOY, new ResourceCost(ResourceType.METAL, 4));
        bottomActionBaseCosts.set(BottomAction.BUILD, new ResourceCost(ResourceType.WOOD, 4));
        bottomActionBaseCosts.set(BottomAction.ENLIST, new ResourceCost(ResourceType.FOOD, 3));

        return new PlayerMat(
            4,
            [new PopularityEvent(playerId, 2), new CoinEvent(playerId, 6)],
            actionMap,
            bottomActionBaseCosts,
            this.defaultRewards()
                .set(BottomAction.UPGRADE, 1)
                .set(BottomAction.DEPLOY, 3)
                .set(BottomAction.ENLIST, 2),
        );
    }

    public static innovative(playerId: PlayerId): PlayerMat {
        const actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.TRADE, BottomAction.UPGRADE);
        actionMap.set(TopAction.PRODUCE, BottomAction.DEPLOY);
        actionMap.set(TopAction.BOLSTER, BottomAction.BUILD);
        actionMap.set(TopAction.MOVE, BottomAction.ENLIST);

        const bottomActionBaseCosts = new Map<BottomAction, ResourceCost>();
        bottomActionBaseCosts.set(BottomAction.UPGRADE, new ResourceCost(ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction.DEPLOY, new ResourceCost(ResourceType.METAL, 3));
        bottomActionBaseCosts.set(BottomAction.BUILD, new ResourceCost(ResourceType.WOOD, 4));
        bottomActionBaseCosts.set(BottomAction.ENLIST, new ResourceCost(ResourceType.FOOD, 3));

        return new PlayerMat(
            5,
            [new PopularityEvent(playerId, 3), new CoinEvent(playerId, 5)],
            actionMap,
            bottomActionBaseCosts,
            this.defaultRewards()
                .set(BottomAction.UPGRADE, 3)
                .set(BottomAction.DEPLOY, 1)
                .set(BottomAction.BUILD, 2),
        );
    }

    /** @TODO: check name */
    public static militant(playerId: PlayerId): PlayerMat {
        const actionMap = new Map<TopAction, BottomAction>();
        actionMap.set(TopAction.BOLSTER, BottomAction.UPGRADE);
        actionMap.set(TopAction.MOVE, BottomAction.DEPLOY);
        actionMap.set(TopAction.PRODUCE, BottomAction.BUILD);
        actionMap.set(TopAction.TRADE, BottomAction.ENLIST);

        const bottomActionBaseCosts = new Map<BottomAction, ResourceCost>();
        bottomActionBaseCosts.set(BottomAction.UPGRADE, new ResourceCost(ResourceType.OIL, 3));
        bottomActionBaseCosts.set(BottomAction.DEPLOY, new ResourceCost(ResourceType.METAL, 3));
        bottomActionBaseCosts.set(BottomAction.BUILD, new ResourceCost(ResourceType.WOOD, 4));
        bottomActionBaseCosts.set(BottomAction.ENLIST, new ResourceCost(ResourceType.FOOD, 3));

        return new PlayerMat(
            3,
            [new PopularityEvent(playerId, 3), new CoinEvent(playerId, 4)],
            actionMap,
            bottomActionBaseCosts,
            this.defaultRewards()
                .set(BottomAction.DEPLOY, 3)
                .set(BottomAction.BUILD, 1)
                .set(BottomAction.ENLIST, 2),
        );
    }

    private static topActionBaseCost(): Map<TopAction, number> {
        const topActionBaseCost = new Map<TopAction, number>();
        topActionBaseCost.set(TopAction.MOVE, 0);
        topActionBaseCost.set(TopAction.BOLSTER, 1);
        topActionBaseCost.set(TopAction.TRADE, 1);
        topActionBaseCost.set(TopAction.PRODUCE, 0);
        return topActionBaseCost;
    }

    private static defaultRewards(): Map<BottomAction, number> {
        return new Map<BottomAction, number>()
            .set(BottomAction.BUILD, 0)
            .set(BottomAction.UPGRADE, 0)
            .set(BottomAction.ENLIST, 0)
            .set(BottomAction.DEPLOY, 0);
    }

    private constructor(
        public readonly startPosition: 1 | 2 | 3 | 4 | 5 | 6 | 7, // the actual game uses 1, 2, 2a, 3, 3a, 4, 5
        public readonly setupEvents: Event[] = [],
        private readonly actionMap: Map<TopAction, BottomAction>,
        public readonly bottomActionBaseCost: Map<BottomAction, ResourceCost>,
        public readonly bottomActionReward: Map<BottomAction, number>,
        public readonly topActionBaseCost: Map<TopAction, number> = PlayerMat.topActionBaseCost(),
    ) {}

    public topActionMatchesBottomAction(
        thisAction: TopAction | BottomAction,
        thatAction: TopAction | BottomAction,
    ): boolean {
        if (thisAction in TopAction && thatAction in BottomAction) {
            return this.actionMap.get(thisAction as TopAction) === thatAction;
        }

        if (thisAction in BottomAction && thatAction in TopAction) {
            return this.actionMap.get(thatAction as TopAction) === thisAction;
        }

        return false;
    }

    public topActionCost(topAction: TopAction): number {
        // @ts-ignore
        return this.topActionBaseCost.get(topAction);
    }

    public bottomActionCost(bottomAction: BottomAction): ResourceCost {
        // @ts-ignore
        return this.bottomActionBaseCost.get(bottomAction);
    }

    public bottomReward(bottomAction: BottomAction): number {
        // @ts-ignore
        return this.bottomActionReward.get(bottomAction);
    }
}

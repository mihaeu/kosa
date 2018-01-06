import {PopularityEvent} from "./Events/PopularityEvent";
import {CoinEvent} from "./Events/CoinEvent";
import {Event} from "./Events/Event";

export class PlayerMat {
    private constructor(public readonly setupEvents: Event[] = []) {}

    public static agricultural(): PlayerMat {
        return new PlayerMat([
            new PopularityEvent(4),
            new CoinEvent(7),
        ]);
    }

    public static engineering(): PlayerMat {
        return new PlayerMat([
            new PopularityEvent(2),
            new CoinEvent(5),
        ]);
    }

    public static industrial(): PlayerMat {
        return new PlayerMat([
            new PopularityEvent(2),
            new CoinEvent(4),
        ]);
    }

    public static mechanical(): PlayerMat {
        return new PlayerMat([
            new PopularityEvent(3),
            new CoinEvent(6),
        ]);
    }

    public static patriotic(): PlayerMat {
        return new PlayerMat([
            new PopularityEvent(2),
            new CoinEvent(6),
        ]);
    }

    public static innovative(): PlayerMat {
        return new PlayerMat([
            new PopularityEvent(3),
            new CoinEvent(5),
        ]);
    }

    /** @TODO: check name */
    public static militant(): PlayerMat {
        return new PlayerMat([
            new PopularityEvent(3),
            new CoinEvent(4),
        ]);
    }
}
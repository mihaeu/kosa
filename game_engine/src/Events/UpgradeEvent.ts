import { BottomAction } from "../BottomAction";
import { PlayerId } from "../PlayerId";
import { TopAction } from "../TopAction";
import { Event } from "./Event";

export class UpgradeEvent implements Event {
    constructor(
        public readonly playerId: PlayerId,
        public readonly topAction: TopAction,
        public readonly bottomAction: BottomAction,
    ) {}
}

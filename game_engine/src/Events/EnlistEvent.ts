import { BottomAction } from "../BottomAction";
import { PlayerId } from "../PlayerId";
import { RecruitReward } from "../RecruitReward";
import { Event } from "./Event";

export class EnlistEvent extends Event {
    constructor(
        public readonly playerId: PlayerId,
        public readonly recruitReward: RecruitReward,
        public readonly bottomAction: BottomAction,
    ) {
        super(playerId);
    }
}

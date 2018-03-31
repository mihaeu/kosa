import { BottomAction } from "../BottomAction";
import { PlayerId } from "../PlayerId";
import { RecruitReward } from "../RecruitReward";
import { Event } from "./Event";

export class EnlistEvent implements Event {
    constructor(
        public readonly playerId: PlayerId,
        public readonly recruitReward: RecruitReward,
        public readonly bottomAction: BottomAction,
    ) {}
}

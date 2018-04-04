import { BottomAction } from "./BottomAction";
import { RecruitReward } from "./RecruitReward";

export class Recruit {
    constructor(public readonly recruitReward: RecruitReward, public readonly bottomAction: BottomAction) {}
}
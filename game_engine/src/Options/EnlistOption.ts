import { BottomAction } from "../BottomAction";
import { RecruitReward } from "../RecruitReward";
import { Option } from "./Option";

export class EnlistOption extends Option {
    constructor(public readonly reward: RecruitReward, public readonly bottomAction: BottomAction) {
        super("EnlistOption");
    }
}

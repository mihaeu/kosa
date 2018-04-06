import { BottomAction } from "../BottomAction";
import { Option } from "./Option";

export class RewardOnlyOption extends Option {
    constructor(public readonly bottomAction: BottomAction) {
        super("ProduceOption");
    }
}

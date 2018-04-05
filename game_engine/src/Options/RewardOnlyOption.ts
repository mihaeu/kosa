import { BottomAction } from "../BottomAction";
import { Option } from "./Option";
import { ProduceOption } from "./ProduceOption";

export class RewardOnlyOption extends Option {
    constructor(public readonly bottomAction: BottomAction) {
        super("ProduceOption");
    }
}

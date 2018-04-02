import { BottomAction } from "../BottomAction";
import { TopAction } from "../TopAction";
import { Option } from "./Option";

export class UpgradeOption extends Option {
    constructor(public readonly topAction: TopAction, public readonly bottomAction: BottomAction) {
        super();
    }
}

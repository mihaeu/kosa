import { BottomAction } from "./BottomAction";
import { TopAction } from "./TopAction";

export class Upgrade {
    constructor(public readonly topAction: TopAction, public readonly bottomAction: BottomAction) {}
}

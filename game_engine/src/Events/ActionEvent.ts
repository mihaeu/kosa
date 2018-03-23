import {TopAction} from "../TopAction";
import {BottomAction} from "../BottomAction";
import {Event} from "./Event";
import {PlayerId} from "../PlayerId";

export class ActionEvent implements Event {
    constructor(public readonly playerId: PlayerId, public readonly action: TopAction|BottomAction) {}
}
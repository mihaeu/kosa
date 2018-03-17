import {TopAction} from "../TopAction";
import {BottomAction} from "../BottomAction";
import {Event} from "./Event";

export class ActionEvent implements Event {
    constructor(public readonly action: TopAction|BottomAction) {}
}
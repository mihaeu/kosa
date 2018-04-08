import { BottomAction } from "../BottomAction";
import { PlayerId } from "../PlayerId";
import { TopAction } from "../TopAction";
import { Event } from "./Event";

export class ActionEvent extends Event {
    constructor(public readonly playerId: PlayerId, public readonly action: TopAction | BottomAction) {
        super(playerId);
    }
}

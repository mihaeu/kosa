import { Player } from "../Player";
import { PlayerId } from "../PlayerId";
import { Event } from "./Event";

export class NewPlayerEvent extends Event {
    constructor(public readonly playerId: PlayerId, public readonly player: Player) {
        super(playerId);
    }
}

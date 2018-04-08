import { PlayerId } from "../PlayerId";
import { UUID } from "../UUID";

export class Event {
    public id: UUID = "";
    public type: string = "";

    constructor(public readonly playerId: PlayerId) {}
}

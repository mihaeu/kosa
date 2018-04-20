import { CoinEvent } from "../src/Events/CoinEvent";
import { Event } from "../src/Events/Event";
import { EventLog } from "../src/Events/EventLog";
import { EventLogSerializer } from "../src/Events/EventLogSerializer";
import { PopularityEvent } from "../src/Events/PopularityEvent";
import { Game } from "../src/Game";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";

test("Serializes EventLog to JSON with one Event per line", () => {
    const playerId = "1";
    const log: Event[] = [new CoinEvent(playerId, 5), new PopularityEvent(playerId, 5), new CoinEvent(playerId, -3)];
    expect(EventLogSerializer.serialize(new EventLog(log))).toEqual(
        `[{"playerId":"1","id":"","type":"CoinEvent","coins":5},` +
            `{"playerId":"1","id":"","type":"PopularityEvent","popularity":5},` +
            `{"playerId":"1","id":"","type":"CoinEvent","coins":-3}]`,
    );
});

test("Deserializes EventLog from serialized JSON format", () => {
    const playerId = "1";
    const eventLog = new EventLog([
        new CoinEvent(playerId, 5),
        new PopularityEvent(playerId, 5),
        new CoinEvent(playerId, -3),
    ]);
    const game = new Game([PlayerFactory.black("1", PlayerMat.agricultural("1"))]);

    expect(EventLogSerializer.deserialize(EventLogSerializer.serialize(eventLog))).toEqual(eventLog);
});

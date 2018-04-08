import { CoinEvent } from "../src/Events/CoinEvent";
import { Event } from "../src/Events/Event";
import { EventLog } from "../src/Events/EventLog";
import { EventLogSerializer } from "../src/Events/EventLogSerializer";
import { PopularityEvent } from "../src/Events/PopularityEvent";
import { PlayerId } from "../src/PlayerId";

test("Serializes EventLog to JSON with one Event per line", () => {
    const playerId = new PlayerId(1);
    const log: Event[] = [new CoinEvent(playerId, 5), new PopularityEvent(playerId, 5), new CoinEvent(playerId, -3)];
    expect(EventLogSerializer.serialize(new EventLog(log))).toEqual(
        `[{"playerId":{"playerId":1},"id":"","type":"CoinEvent","coins":5},` +
            `{"playerId":{"playerId":1},"id":"","type":"PopularityEvent","popularity":5},` +
            `{"playerId":{"playerId":1},"id":"","type":"CoinEvent","coins":-3}]`,
    );
});

test("Deserializes EventLog from serialized JSON format", () => {
    const playerId = new PlayerId(1);
    const eventLog = new EventLog([
        new CoinEvent(playerId, 5),
        new PopularityEvent(playerId, 5),
        new CoinEvent(playerId, -3),
    ]);
    expect(EventLogSerializer.deserialize(EventLogSerializer.serialize(eventLog))).toEqual(eventLog);
});

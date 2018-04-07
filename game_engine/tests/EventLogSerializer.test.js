"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoinEvent_1 = require("../src/Events/CoinEvent");
const EventLog_1 = require("../src/Events/EventLog");
const EventLogSerializer_1 = require("../src/Events/EventLogSerializer");
const PopularityEvent_1 = require("../src/Events/PopularityEvent");
const PlayerId_1 = require("../src/PlayerId");
test("Serializes EventLog to JSON with one Event per line", () => {
    const playerId = new PlayerId_1.PlayerId(1);
    const log = [new CoinEvent_1.CoinEvent(playerId, 5), new PopularityEvent_1.PopularityEvent(playerId, 5), new CoinEvent_1.CoinEvent(playerId, -3)];
    expect(EventLogSerializer_1.EventLogSerializer.serialize(new EventLog_1.EventLog(log))).toEqual(`[{"playerId":{"playerId":1},"coins":5,"type":"CoinEvent"},` +
        `{"playerId":{"playerId":1},"popularity":5,"type":"PopularityEvent"},` +
        `{"playerId":{"playerId":1},"coins":-3,"type":"CoinEvent"}]`);
});
test("Deserializes EventLog from serialized JSON format", () => {
    const playerId = new PlayerId_1.PlayerId(1);
    const eventLog = new EventLog_1.EventLog([
        new CoinEvent_1.CoinEvent(playerId, 5),
        new PopularityEvent_1.PopularityEvent(playerId, 5),
        new CoinEvent_1.CoinEvent(playerId, -3),
    ]);
    expect(EventLogSerializer_1.EventLogSerializer.deserialize(EventLogSerializer_1.EventLogSerializer.serialize(eventLog))).toEqual(eventLog);
});

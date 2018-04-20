"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoinEvent_1 = require("../src/Events/CoinEvent");
const EventLog_1 = require("../src/Events/EventLog");
const EventLogSerializer_1 = require("../src/Events/EventLogSerializer");
const PopularityEvent_1 = require("../src/Events/PopularityEvent");
const Game_1 = require("../src/Game");
const PlayerFactory_1 = require("../src/PlayerFactory");
const PlayerMat_1 = require("../src/PlayerMat");
test("Serializes EventLog to JSON with one Event per line", () => {
    const playerId = "1";
    const log = [new CoinEvent_1.CoinEvent(playerId, 5), new PopularityEvent_1.PopularityEvent(playerId, 5), new CoinEvent_1.CoinEvent(playerId, -3)];
    expect(EventLogSerializer_1.EventLogSerializer.serialize(new EventLog_1.EventLog(log))).toEqual(`[{"playerId":"1","id":"","type":"CoinEvent","coins":5},` +
        `{"playerId":"1","id":"","type":"PopularityEvent","popularity":5},` +
        `{"playerId":"1","id":"","type":"CoinEvent","coins":-3}]`);
});
test.skip("Deserializes EventLog from serialized JSON format", () => {
    const game = new Game_1.Game([PlayerFactory_1.PlayerFactory.black("1", PlayerMat_1.PlayerMat.agricultural("1"))]);
    expect(EventLogSerializer_1.EventLogSerializer.deserialize(EventLogSerializer_1.EventLogSerializer.serialize(game.log))).toEqual(game.log);
});

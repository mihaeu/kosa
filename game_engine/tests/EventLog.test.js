"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventLog_1 = require("../src/Events/EventLog");
const Game_1 = require("../src/Game");
const PlayerFactory_1 = require("../src/PlayerFactory");
const PlayerMat_1 = require("../src/PlayerMat");
describe("Revert", () => {
    const log = new EventLog_1.EventLog();
    beforeEach(() => {
        const game = new Game_1.Game([PlayerFactory_1.PlayerFactory.black("1", PlayerMat_1.PlayerMat.agricultural("1"))], log);
    });
    test("Does not revert of id not in log", () => {
        expect(log.resetUntilEvent("no uuid").log.length).toEqual(11);
    });
    test("Reverts log until (and still including) event", () => {
        const id = log.log[5].id;
        expect(log.resetUntilEvent(id).log.length).toEqual(6);
    });
});

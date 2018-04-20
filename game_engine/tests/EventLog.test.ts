import { EventLog } from "../src/Events/EventLog";
import { Game } from "../src/Game";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerMat } from "../src/PlayerMat";

describe("Revert", () => {
    const log = new EventLog();
    beforeEach(() => {
        const game = new Game([PlayerFactory.black("1", PlayerMat.agricultural("1"))], log);
    });

    test("Does not revert of id not in log", () => {
        expect(log.resetUntilEvent("no uuid").log.length).toEqual(11);
    });

    test("Reverts log until (and still including) event", () => {
        const id = log.log[5].id;
        expect(log.resetUntilEvent(id).log.length).toEqual(6);
    });
});

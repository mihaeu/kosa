import { BottomAction } from "../src/BottomAction";
import { PlayerMat } from "../src/PlayerMat";
import { TopAction } from "../src/TopAction";

const playerId = "1";

test("Agricultural player mat combines move and upgrade", () => {
    expect(
        PlayerMat.agricultural(playerId).topActionMatchesBottomAction(TopAction.MOVE, BottomAction.UPGRADE),
    ).toBeTruthy();
});

test("Agricultural player mat cannot combine move with anything but upgrade", () => {
    expect(
        PlayerMat.agricultural(playerId).topActionMatchesBottomAction(TopAction.MOVE, BottomAction.BUILD),
    ).toBeFalsy();
    expect(
        PlayerMat.agricultural(playerId).topActionMatchesBottomAction(TopAction.MOVE, BottomAction.ENLIST),
    ).toBeFalsy();
    expect(
        PlayerMat.agricultural(playerId).topActionMatchesBottomAction(TopAction.MOVE, BottomAction.DEPLOY),
    ).toBeFalsy();
});

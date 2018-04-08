"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BottomAction_1 = require("../src/BottomAction");
const PlayerMat_1 = require("../src/PlayerMat");
const TopAction_1 = require("../src/TopAction");
const playerId = "1";
test("Agricultural player mat combines move and upgrade", () => {
    expect(PlayerMat_1.PlayerMat.agricultural(playerId).topActionMatchesBottomAction(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.UPGRADE)).toBeTruthy();
});
test("Agricultural player mat cannot combine move with anything but upgrade", () => {
    expect(PlayerMat_1.PlayerMat.agricultural(playerId).topActionMatchesBottomAction(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.BUILD)).toBeFalsy();
    expect(PlayerMat_1.PlayerMat.agricultural(playerId).topActionMatchesBottomAction(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.ENLIST)).toBeFalsy();
    expect(PlayerMat_1.PlayerMat.agricultural(playerId).topActionMatchesBottomAction(TopAction_1.TopAction.MOVE, BottomAction_1.BottomAction.DEPLOY)).toBeFalsy();
});

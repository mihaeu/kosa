"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Availability_1 = require("../src/Availability");
const BottomAction_1 = require("../src/BottomAction");
const EventLog_1 = require("../src/Events/EventLog");
const Game_1 = require("../src/Game");
const GameInfo_1 = require("../src/GameInfo");
const PlayerFactory_1 = require("../src/PlayerFactory");
const PlayerId_1 = require("../src/PlayerId");
const PlayerMat_1 = require("../src/PlayerMat");
const TopAction_1 = require("../src/TopAction");
const randomAction = (xs) => {
    return xs[Math.floor(Math.random() * Math.floor(xs.length))];
};
let playerId;
let player;
let log;
let players;
let game;
let stars = [];
do {
    playerId = new PlayerId_1.PlayerId(1);
    player = PlayerFactory_1.PlayerFactory.black(playerId, PlayerMat_1.PlayerMat.industrial(playerId));
    log = new EventLog_1.EventLog();
    players = [player];
    game = new Game_1.Game(players, log);
    let count = 0;
    while (count < 100) {
        count += 1;
        const topActions = Availability_1.availableTopActions(log, player);
        if (topActions.length > 0) {
            const topAction = randomAction(topActions);
            switch (topAction) {
                case TopAction_1.TopAction.MOVE:
                    game.actionFromOption(player, randomAction(Availability_1.availableMoveOptions(log, player)));
                    break;
                case TopAction_1.TopAction.PRODUCE:
                    game.actionFromOption(player, randomAction(Availability_1.availableProduceOptions(log, player)));
                    break;
                case TopAction_1.TopAction.BOLSTER:
                    game.actionFromOption(player, randomAction(Availability_1.availableBolsterOptions(log, player)));
                    break;
                case TopAction_1.TopAction.TRADE:
                    game.actionFromOption(player, randomAction(Availability_1.availableTradeOptions(log, player)));
                    break;
            }
        }
        const bottomActions = Availability_1.availableBottomActions(log, player);
        if (bottomActions.length > 0) {
            const bottomAction = randomAction(bottomActions);
            switch (bottomAction) {
                case BottomAction_1.BottomAction.BUILD:
                    game.actionFromOption(player, randomAction(Availability_1.availableBuildOptions(log, player)));
                    break;
                case BottomAction_1.BottomAction.DEPLOY:
                    game.actionFromOption(player, randomAction(Availability_1.availableDeployOptions(log, player)));
                    break;
                case BottomAction_1.BottomAction.UPGRADE:
                    game.actionFromOption(player, randomAction(Availability_1.availableUpgradeOptions(log, player)));
                    break;
                case BottomAction_1.BottomAction.ENLIST:
                    game.actionFromOption(player, randomAction(Availability_1.availableEnlistOptions(log, player)));
                    break;
            }
        }
    }
    stars = GameInfo_1.GameInfo.stars(log, player);
    console.log(`Stopped at count ${count} with ${stars.length ? stars : "no"} stars.`);
} while (stars.length < 5);

import {
    availableBolsterOptions,
    availableBottomActions,
    availableBuildOptions,
    availableDeployOptions,
    availableEnlistOptions,
    availableMoveOptions,
    availableProduceOptions,
    availableTopActions,
    availableTradeOptions,
    availableUpgradeOptions,
} from "../src/Availability";
import { BottomAction } from "../src/BottomAction";
import { EventLog } from "../src/Events/EventLog";
import { Game } from "../src/Game";
import { GameInfo } from "../src/GameInfo";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";
import { Star } from "../src/Star";
import { TopAction } from "../src/TopAction";

const randomAction = <T>(xs: T[]): T => xs[Math.floor(Math.random() * Math.floor(xs.length))];

let playerId;
let player;
let log;
let players;
let game;
let stars: Star[] = [];

do {

    playerId = "1";
    player = PlayerFactory.black(playerId, PlayerMat.industrial(playerId));
    log = new EventLog();
    players = [player];
    game = new Game(players, log);

    let count = 0;

    while (count < 100) {
        count += 1;
        const topActions = availableTopActions(log, player);
        if (topActions.length > 0) {
            const topAction = randomAction(topActions);
            switch (topAction) {
                case TopAction.MOVE:
                    game.actionFromOption(player, randomAction(availableMoveOptions(log, player)));
                    break;
                case TopAction.PRODUCE:
                    game.actionFromOption(player, randomAction(availableProduceOptions(log, player)));
                    break;
                case TopAction.BOLSTER:
                    game.actionFromOption(player, randomAction(availableBolsterOptions(log, player)));
                    break;
                case TopAction.TRADE:
                    game.actionFromOption(player, randomAction(availableTradeOptions(log, player)));
                    break;
            }
        }

        const bottomActions = availableBottomActions(log, player);
        if (bottomActions.length > 0) {
            const bottomAction = randomAction(bottomActions);
            switch (bottomAction) {
                case BottomAction.BUILD:
                    game.actionFromOption(player, randomAction(availableBuildOptions(log, player)));
                    break;
                case BottomAction.DEPLOY:
                    game.actionFromOption(player, randomAction(availableDeployOptions(log, player)));
                    break;
                case BottomAction.UPGRADE:
                    game.actionFromOption(player, randomAction(availableUpgradeOptions(log, player)));
                    break;
                case BottomAction.ENLIST:
                    game.actionFromOption(player, randomAction(availableEnlistOptions(log, player)));
                    break;
            }
        }
    }

    stars = GameInfo.stars(log, player);
    console.log(
        `Stopped at count ${count} with ${stars.length ? stars : "no"} stars.`,
    );

} while (stars.length < 5);

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
import { Option } from "../src/Options/Option";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";
import { TopAction } from "../src/TopAction";

test.skip("Random single player game finishes eventually", () => {
    const playerId = new PlayerId(1);
    const player = PlayerFactory.green(playerId, PlayerMat.industrial(playerId));
    const log = new EventLog();
    const players = [player];
    const game = new Game(players, log);

    function randomAction<T>(xs: T[]): T {
        return xs[Math.floor(Math.random() * Math.floor(xs.length))];
    }

    let count = 0;
    while (GameInfo.stars(log, player).length < 1) {
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
    expect(GameInfo.stars(log, player).length).toBe(1);
});

import net = require("net");
import * as _ from "ramda";
import {Game} from "../game_engine/src/Game";
import {GameInfo} from "../game_engine/src/GameInfo";
import {Option} from "../game_engine/src/Options/Option";
import {availableBottomActions, availableOptionsForAction, availableTopActions,} from "../game_engine/src/Availability";
import {PlayerFactory} from "../game_engine/src/PlayerFactory";
import {PlayerMat} from "../game_engine/src/PlayerMat";
import {PlayerId} from "../game_engine/src/PlayerId";
import {Player} from "../game_engine/src/Player";
import {BolsterCombatCardsOption} from "../game_engine/src/options/BolsterCombatCardsOption";
import {BolsterPowerOption} from "../game_engine/src/options/BolsterPowerOption";
import {BuildOption} from "../game_engine/src/options/BuildOption";
import {DeployOption} from "../game_engine/src/options/DeployOption";
import {EnlistOption} from "../game_engine/src/options/EnlistOption";
import {GainCoinOption} from "../game_engine/src/options/GainCoinOption";
import {MoveOption} from "../game_engine/src/options/MoveOption";
import {Option} from "../game_engine/src/options/Option";
import {ProduceOption} from "../game_engine/src/options/ProduceOption";
import {RewardOnlyOption} from "../game_engine/src/options/RewardOnlyOption";
import {TradePopularityOption} from "../game_engine/src/options/TradePopularityOption";
import {TradeResourcesOption} from "../game_engine/src/options/TradeResourcesOption";
import {UpgradeOption} from "../game_engine/src/options/UpgradeOption";
import {Socket} from "net";
import {v4} from "uuid";

const welcomeMessage = `
#######################
#   Kosa Game Server  #
#######################

Commands:
    WAITING
        List all games waiting for players
    RUNNING
        List all active games
    FINISHED
        List all finished games
    NEW
        Opens a new game
    JOIN <gameId> <faction> <playerMat>
        Join a game
    START <gameId>
        Starts a game
    ACTION <gameId> <playerId>
        List available action
    ACTION <gameId> <playerId> <action>
        List available options for an action
    OPTION <gameId> <playerId> <option>

Arguments:
    <gameId>        UUID v4 strings which you get after joining a game.
    <playerId>      UUID v4 strings which you get after joining the server.
    <faction>       one of the following: green black yellow white purple blue red
    <playerMat>     one of the following: engineering agricultural industrial mechanical patriotic innovative militant
    <action>        one of the following: trade move bolster produce
    <option>        index of the options you got from the available action command
    
`;

type GameId = string;

const clients = new Map<string, Socket>();
const waitingGames: Map<GameId, Player[]> = new Map();
const runningGames: Map<GameId, Game> = new Map();
const finishedGames: GameId[] = [];

const broadcast = (message: string, allClients: Map<string, Socket>): void => {
    for (const [uuid, socket] of allClients) {
        socket.write(infoMsg(message));
    }
};

const infoMsg = (message: string) => `\n\x1b[33;01m${message}\x1b[0m\n`;
const errorMsg = (message: string) => `\n\x1b[31;01m${message}\x1b[0m\n`;

enum Command {
    WAITING = "WAITING",
    RUNNING = "RUNNING",
    FINISHED = "FINISHED",
    NEW = "NEW",
    JOIN = "JOIN",
    START = "START",
    ACTION = "ACTION",
    OPTION = "OPTION",
}

// temp hack
const hackyOptions: Map<PlayerId, Option[]> = new Map();

const server = net.createServer((socket) => {

    const playerUuid = v4();
    clients.set(playerUuid, socket);
    broadcast(`${playerUuid} joined the server ...\n`, clients);

    socket.on("data", (data) => {
        const request = data.toString().trim();

        if (request.toUpperCase() === Command.WAITING) {
            /**
             * SHOW WAITING GAMES
             */
            socket.write(JSON.stringify(Array.from(waitingGames.entries())) + "\n");
        } else if (request.toUpperCase() === Command.RUNNING) {
            /**
             * SHOW RUNNING GAMES
             */
            socket.write(JSON.stringify(Array.from(runningGames.entries())) + "\n");
        } else if (request.toUpperCase() === Command.FINISHED) {
            /**
             * SHOW FINISHED GAMES
             */
            socket.write(JSON.stringify(Array.from(finishedGames.entries())) + "\n");
        } else if (request.toUpperCase() === Command.NEW) {
            /**
             * START A NEW GAME
             */
            const gameId = v4();
            waitingGames.set(gameId, []);
            broadcast(`${playerUuid} opened a new game ${gameId} ...\n`, clients);
        } else if (request.toUpperCase().startsWith(Command.JOIN)) {
            /**
             * JOIN AN EXISTING GAME
             */

            const matches = request.split(" ");

            try {
                const gameId = matches[1];
                const faction = matches[2].toUpperCase();
                const playerMat = matches[3].toLowerCase();
                const playerId = new PlayerId(playerUuid);
                const player = PlayerFactory.createFromString(
                    faction,
                    playerId,
                    PlayerMat.createFromString(playerMat, playerId),
                );
                waitingGames.get(gameId).push(player);

                broadcast(
                    `${playerUuid} joined game ${gameId} (${waitingGames.get(gameId).length} player(s)) ...\n`, clients,
                );
            } catch (error) {
                socket.write(error("JOIN <gameId> <faction> <playerMat>\n"));
            }
        } else if (request.toUpperCase().startsWith(Command.START)) {
            /**
             * START A GAME
             */

            const matches = request.split(" ");
            if (matches.length < 2) {
                socket.write(errorMsg("START <gameId>\n"));
                return;
            }
            const gameId = matches[1];

            try {
                const game = new Game(waitingGames.get(gameId));
                waitingGames.delete(gameId);
                runningGames.set(gameId, game);

                broadcast(
                    `${playerUuid} started game ${gameId} ...\n`, clients,
                );
            } catch (error) {
                socket.write(errorMsg(`Something went wrong:\n\n${error.message}\n`));
            }
        } else if (request.toUpperCase().startsWith(Command.ACTION)) {
            /**
             * SHOW AVAILABLE ACTIONS / SHOW OPTIONS FOR ACTION
             *
             * ACTION <gameId> <playerId>
             * ACTION <gameId> <playerId> <action>
             */
            const matches = request.split(" ");
            if (matches.length < 3) {
                socket.write(errorMsg("ACTION <gameId> <playerId>\n"));
                socket.write(errorMsg("ACTION <gameId> <playerId> TRADE|BOLSTER|MOVE|PRODUCE\n"));
            }

            const gameId = matches[1];
            const game = runningGames.get(gameId);

            const playerId = matches[2];
            const currentPlayer = _.find(
                (player: Player) => playerId === player.playerId.playerId,
                GameInfo.players(game.log),
            );

            if (currentPlayer === undefined) {
                socket.write(errorMsg("Player not found ...\n"));
            }

            if (matches.length === 3) {
                socket.write(
                    availableTopActions(game.log, currentPlayer).join(", ") +
                    "\n" +
                    availableBottomActions(game.log, currentPlayer).join(", ") + "\n",
                );
            } else if (matches.length === 4) {
                const action = matches[3].toUpperCase();
                const options = availableOptionsForAction(action, game.log, currentPlayer);
                hackyOptions.set(playerId, options);
                for (const index in options) {
                    socket.write(`[${index}]\n    ` + JSON.stringify(options[index]) + "\n");
                }
            }
        } else if (request.toUpperCase().startsWith(Command.OPTION)) {
            /**
             * TAKE A SPECIFIC ACTION
             *
             * OPTION <gameId> <playerId> <option>
             */
            const matches = request.split(" ");
            if (matches.length < 4) {
                socket.write(errorMsg("OPTION <gameId> <playerId> <option>\n"));
                return;
            }

            const gameId = matches[1];
            const game = runningGames.get(gameId);

            const playerId = matches[2];
            try {
                const currentPlayer = _.find(
                    (player: Player) => playerId === player.playerId.playerId,
                    GameInfo.players(game.log),
                );

                const optionIndex = parseInt(matches[3], 10);
                if (optionIndex === undefined) {
                    socket.write("Option doesn't exist ....\n");
                }
                game.actionFromOption(currentPlayer, hackyOptions.get(playerId)[optionIndex]);

                if (GameInfo.gameOver(game.log)) {
                    broadcast(`Game ${gameId} is over ...`);
                    finishedGames.push(gameId);
                    runningGames.delete(gameId);
                }
            } catch (error) {
                socket.write(error("Something went wrong ...\n"));
            }
        }

        if (request.length === 0) {
            socket.write(welcomeMessage);
        }
    });
});

const hostname = process.argv[2] ? process.argv[2] : "0.0.0.0";
const port = process.argv[3] ? parseInt(process.argv[3], 10) : 1337;
server.listen(port, hostname);

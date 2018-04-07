import * as fs from "fs";
import net = require("net");
import { Socket } from "net";
import * as _ from "ramda";
import { v4 } from "uuid";
import {
    availableBottomActions,
    availableOptionsForAction,
    availableTopActions,
} from "../game_engine/src/Availability";
import { EventLogSerializer } from "../game_engine/src/Events/EventLogSerializer";
import { Game } from "../game_engine/src/Game";
import { GameInfo } from "../game_engine/src/GameInfo";
import { Option } from "../game_engine/src/Options/Option";
import { Player } from "../game_engine/src/Player";
import { PlayerFactory } from "../game_engine/src/PlayerFactory";
import { PlayerId } from "../game_engine/src/PlayerId";
import { PlayerMat } from "../game_engine/src/PlayerMat";
import ErrnoException = NodeJS.ErrnoException;

const helpMessage = fs.readFileSync("./helpMessage.txt");

type GameUUID = string;
type PlayerUUID = string;

const clients = new Map<string, Socket>();
const waitingGames: Map<GameUUID, Player[]> = new Map();
const runningGames: Map<GameUUID, Game> = new Map();
const finishedGames: GameUUID[] = [];

const broadcast = (message: string, allClients: Map<string, Socket>): void => {
    for (const [uuid, socket] of allClients) {
        socket.write(infoMsg(message));
    }
};

const infoMsg = (message: string) => `\n\x1b[33;01m${message}\x1b[0m\n`;
const errorMsg = (message: string) => `\n\x1b[31;01m${message}\x1b[0m\n`;
const successMsg = (message: string) => `\n\x1b[32;01m${message}\x1b[0m\n`;

enum Command {
    WAITING = "WAITING",
    RUNNING = "RUNNING",
    FINISHED = "FINISHED",
    NEW = "NEW",
    JOIN = "JOIN",
    START = "START",
    STOP = "STOP",
    ACTION = "ACTION",
    OPTION = "OPTION",
    SU = "SU",
    EXPORT = "EXPORT",
    IMPORT = "IMPORT",
}

// temp hack
const hackyOptions: Map<PlayerUUID, Option[]> = new Map();

if (!fs.existsSync("./finished")) {
    fs.mkdirSync("./finished");
}

const server = net.createServer((socket) => {
    let playerUuid = v4();
    clients.set(playerUuid, socket);
    broadcast(`${playerUuid} joined the server ...\n`, clients);

    socket.on("end", () => {
        clients.delete(playerUuid);
        broadcast(`${playerUuid} left the server ...\n`, clients);
    });

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
        } else if (request.toUpperCase().startsWith(Command.SU)) {
            /**
             * SWITCH TO ANOTHER USER/PLAYER
             */
            const matches = request.split(" ");
            const newPlayerUuid: PlayerUUID = matches[1];
            if (newPlayerUuid === undefined) {
                socket.write(errorMsg("SU <playerId>"));
            } else {
                clients.delete(playerUuid);
                clients.set(newPlayerUuid, socket);
                broadcast(infoMsg(`${playerUuid} is now ${newPlayerUuid}`), clients);
                playerUuid = newPlayerUuid;
            }
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
                    `${playerUuid} joined game ${gameId} (${waitingGames.get(gameId).length} player(s)) ...\n`,
                    clients,
                );
            } catch (error) {
                socket.write(errorMsg(`JOIN <gameId> <faction> <playerMat>\n\n${error.message}\n`));
            }
        } else if (request.toUpperCase().startsWith(Command.START)) {
            /**
             * START A GAME
             */

            const matches = request.split(" ");
            const gameId = matches[1];
            if (gameId === undefined) {
                socket.write(errorMsg("START <gameId>\n"));
            } else {
                try {
                    const game = new Game(waitingGames.get(gameId));
                    waitingGames.delete(gameId);
                    runningGames.set(gameId, game);

                    broadcast(`${playerUuid} started game ${gameId} ...\n`, clients);
                } catch (error) {
                    socket.write(errorMsg(`Something went wrong:\n\n${error.message}\n`));
                }
            }
        } else if (request.toUpperCase().startsWith(Command.STOP)) {
            /**
             * STOP A GAME
             */

            const matches = request.split(" ");
            const gameId = matches[1];
            if (gameId === undefined || !runningGames.has(gameId)) {
                socket.write(errorMsg(`STOP <gameId>\n`));
            } else {
                finishedGames.push(gameId);
                const game = runningGames.get(gameId);
                fs.writeFile(
                    `./finished/${gameId}`,
                    EventLogSerializer.serialize(game.log),
                    (err: ErrnoException) => err
                        ? socket.write(errorMsg(`Failed to serialize ${gameId}\n`))
                        : socket.write(successMsg(`Stopped and saved game to finished/${gameId}\n`)),
                );
                runningGames.delete(gameId);
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
            } else {
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
                            availableBottomActions(game.log, currentPlayer).join(", ") +
                            "\n",
                    );
                } else if (matches.length === 4) {
                    const action = matches[3].toUpperCase();
                    const options = availableOptionsForAction(action, game.log, currentPlayer);
                    hackyOptions.set(playerId, options);
                    for (const index in options) {
                        socket.write(`[${index}]\n    ` + JSON.stringify(options[index]) + "\n");
                    }
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
            } else {
                const gameId = matches[1];
                const game = runningGames.get(gameId) as Game;

                const playerId = matches[2];
                try {
                    const currentPlayer = _.find(
                        (player: Player) => playerId === player.playerId.playerId,
                        GameInfo.players(game.log),
                    ) as Player;

                    const optionIndex = parseInt(matches[3], 10);
                    if (optionIndex === undefined) {
                        socket.write(errorMsg("Option doesn't exist ....\n"));
                    }
                    game.actionFromOption(currentPlayer, hackyOptions.get(playerId)[optionIndex]);

                    if (GameInfo.gameOver(game.log)) {
                        broadcast(successMsg(`Game ${gameId} is over ...`), clients);
                        finishedGames.push(gameId);
                        runningGames.delete(gameId);

                        fs.writeFile(
                            `./finished/${gameId}`,
                            EventLogSerializer.serialize(game.log),
                            (err: ErrnoException) => err
                                ? socket.write(errorMsg(`Failed to serialize ${gameId}\n`))
                                : socket.write(successMsg(`Saved game to finished/${gameId}\n`)),
                        );
                    }
                } catch (error) {
                    socket.write(errorMsg(`Something went wrong ...\n\n${error.message}\n`));
                }
            }
        } else if (request.toUpperCase().startsWith(Command.IMPORT)) {
            /**
             * IMPORT GAME STATE AND ADD TO WAITING
             *
             * IMPORT <gameId> <serializedEvents>
             */
            const matches = request.split(" ");
            const gameId = matches[1];
            const serializedEventLog = matches[2];
            if (gameId === undefined || serializedEventLog === undefined) {
                socket.write(errorMsg(`IMPORT <gameId> <serializedEvents>\n`))
            } else {
                try {
                    const log = EventLogSerializer.deserialize(serializedEventLog);
                    runningGames.set(gameId, new Game(GameInfo.players(log), log));
                    broadcast(infoMsg(`${playerUuid} imported ${gameId}`), clients);
                } catch (e) {
                    socket.write(`Unable to import game state\n\n${e.message}\n`);
                }
            }

        } else if (request.toUpperCase().startsWith(Command.EXPORT)) {
            /**
             * EXPORT GAME STATE
             *
             * EXPORT <gameId>
             */

            const matches = request.split(" ");
            const gameId = matches[1];
            if (gameId === undefined) {
                socket.write(errorMsg(`EXPORT <gameId>\n`));
            } else {
                try {
                    const game = runningGames.get(gameId) as Game;
                    socket.write(EventLogSerializer.serialize(game.log) + "\n\n");
                } catch (e) {
                    socket.write(`Unable to export game state\n\n${e.message}\n`);
                }
            }

        } else {
            socket.write(helpMessage);
        }
    });
});

const hostname = process.argv[2] ? process.argv[2] : "0.0.0.0";
const port = process.argv[3] ? parseInt(process.argv[3], 10) : 1337;
server.listen(port, hostname);

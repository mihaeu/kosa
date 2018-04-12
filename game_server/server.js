"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const net = require("net");
const _ = require("ramda");
const express = require("express");
const uuid_1 = require("uuid");
const Availability_1 = require("../game_engine/src/Availability");
const EventLogSerializer_1 = require("../game_engine/src/Events/EventLogSerializer");
const Game_1 = require("../game_engine/src/Game");
const GameInfo_1 = require("../game_engine/src/GameInfo");
const PlayerFactory_1 = require("../game_engine/src/PlayerFactory");
const PlayerMat_1 = require("../game_engine/src/PlayerMat");
const helpMessage = fs.readFileSync("./helpMessage.txt");
const clients = new Map();
const waitingGames = new Map();
const runningGames = new Map();
const finishedGames = [];
const broadcast = (message, allClients) => {
    for (const [uuid, socket] of allClients) {
        socket.write(infoMsg(message) + "\n\n");
    }
};
const infoMsg = (message) => `\n\x1b[33;01m${message}\x1b[0m\n`;
const errorMsg = (message) => `\n\x1b[31;01m${message}\x1b[0m\n`;
const successMsg = (message) => `\n\x1b[32;01m${message}\x1b[0m\n`;
var Command;
(function (Command) {
    Command["WAITING"] = "WAITING";
    Command["RUNNING"] = "RUNNING";
    Command["FINISHED"] = "FINISHED";
    Command["NEW"] = "NEW";
    Command["JOIN"] = "JOIN";
    Command["START"] = "START";
    Command["STATS"] = "STATS";
    Command["STOP"] = "STOP";
    Command["ACTION"] = "ACTION";
    Command["OPTION"] = "OPTION";
    Command["SU"] = "SU";
    Command["SG"] = "SG";
    Command["EXPORT"] = "EXPORT";
    Command["IMPORT"] = "IMPORT";
})(Command || (Command = {}));
// temp hack
const hackyOptions = new Map();
if (!fs.existsSync("./finished")) {
    fs.mkdirSync("./finished");
}
const server = net.createServer((socket) => {
    let playerUuid = uuid_1.v4();
    clients.set(playerUuid, socket);
    broadcast(`${playerUuid} joined the server ...`, clients);
    socket.on("end", () => {
        clients.delete(playerUuid);
        broadcast(`${playerUuid} left the server ...`, clients);
    });
    socket.on("data", (data) => {
        const request = data.toString().trim().replace(/  +/, " ");
        if (request.toUpperCase() === Command.WAITING) {
            /**
             * SHOW WAITING GAMES
             */
            socket.write(JSON.stringify(Array.from(waitingGames.entries())) + "\n\n");
        }
        else if (request.toUpperCase() === Command.RUNNING) {
            /**
             * SHOW RUNNING GAMES
             */
            socket.write(JSON.stringify(Array.from(runningGames.entries())) + "\n\n");
        }
        else if (request.toUpperCase() === Command.FINISHED) {
            /**
             * SHOW FINISHED GAMES
             */
            socket.write(JSON.stringify(Array.from(finishedGames.entries())) + "\n\n");
        }
        else if (request.toUpperCase() === Command.NEW) {
            /**
             * START A NEW GAME
             */
            const gameId = uuid_1.v4();
            waitingGames.set(gameId, []);
            broadcast(`${playerUuid} opened a new game ${gameId} ...`, clients);
        }
        else if (request.toUpperCase().startsWith(Command.SU)) {
            /**
             * SWITCH TO ANOTHER USER/PLAYER
             */
            const matches = request.split(" ");
            const newPlayerUuid = matches[1];
            if (newPlayerUuid === undefined) {
                socket.write(errorMsg("SU <playerId>"));
            }
            else {
                clients.delete(playerUuid);
                clients.set(newPlayerUuid, socket);
                broadcast(infoMsg(`${playerUuid} is now ${newPlayerUuid}`), clients);
                playerUuid = newPlayerUuid;
            }
        }
        else if (request.toUpperCase().startsWith(Command.SG)) {
            /**
             * SWITCH NAME OF CURRENT GAME
             */
            const matches = request.split(" ");
            const gameId = matches[1];
            const newGameId = matches[2];
            const runningGame = runningGames.get(gameId);
            const waitingGame = waitingGames.get(gameId);
            if (runningGame !== undefined) {
                runningGames.set(newGameId, runningGame);
                runningGames.delete(gameId);
                broadcast(`${playerUuid} changed game ${gameId} to ${newGameId} ...`, clients);
            }
            else if (waitingGame !== undefined) {
                waitingGames.set(newGameId, waitingGame);
                waitingGames.delete(gameId);
                broadcast(`${playerUuid} changed game ${gameId} to ${newGameId} ...`, clients);
            }
            else {
                socket.write(errorMsg("SG <gameId> <newGameId>"));
            }
        }
        else if (request.toUpperCase().startsWith(Command.JOIN)) {
            /**
             * JOIN AN EXISTING GAME
             */
            const matches = request.split(" ");
            try {
                const gameId = matches[1];
                const faction = matches[2].toUpperCase();
                const playerMat = matches[3].toLowerCase();
                const player = PlayerFactory_1.PlayerFactory.createFromString(faction, playerUuid, PlayerMat_1.PlayerMat.createFromString(playerMat, playerUuid));
                waitingGames.get(gameId).push(player);
                broadcast(`${playerUuid} joined game ${gameId} (${waitingGames.get(gameId).length} player(s)) ...`, clients);
            }
            catch (error) {
                socket.write(errorMsg(`JOIN <gameId> <faction> <playerMat>\n\n${error.message}\n`));
            }
        }
        else if (request.toUpperCase().startsWith(Command.START)) {
            /**
             * START A GAME
             */
            const matches = request.split(" ");
            const gameId = matches[1];
            if (gameId === undefined) {
                socket.write(errorMsg("START <gameId>\n"));
            }
            else {
                try {
                    const game = new Game_1.Game(waitingGames.get(gameId));
                    waitingGames.delete(gameId);
                    runningGames.set(gameId, game);
                    broadcast(`${playerUuid} started game ${gameId} ...`, clients);
                }
                catch (error) {
                    socket.write(errorMsg(`Something went wrong:\n\n${error.message}\n\n`));
                }
            }
        }
        else if (request.toUpperCase().startsWith(Command.STOP)) {
            /**
             * STOP A GAME
             */
            const matches = request.split(" ");
            const gameId = matches[1];
            if (gameId === undefined || !runningGames.has(gameId)) {
                socket.write(errorMsg(`STOP <gameId>\n`));
            }
            else {
                finishedGames.push(gameId);
                const game = runningGames.get(gameId);
                fs.writeFile(`./finished/${gameId}`, EventLogSerializer_1.EventLogSerializer.serialize(game.log), (err) => err
                    ? socket.write(errorMsg(`Failed to serialize ${gameId}\n\n`))
                    : socket.write(successMsg(`Stopped and saved game to finished/${gameId}\n\n`)));
                runningGames.delete(gameId);
            }
        }
        else if (request.toUpperCase().startsWith(Command.ACTION)) {
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
            else {
                const gameId = matches[1];
                const game = runningGames.get(gameId);
                const playerId = matches[2];
                const currentPlayer = _.find((player) => playerId === player.playerId, GameInfo_1.GameInfo.players(game.log));
                if (currentPlayer === undefined) {
                    socket.write(errorMsg("Player not found ...\n"));
                }
                if (matches.length === 3) {
                    socket.write(JSON.stringify(Availability_1.availableTopActions(game.log, currentPlayer).concat(Availability_1.availableBottomActions(game.log, currentPlayer))) + "\n\n");
                }
                else if (matches.length === 4) {
                    const action = matches[3].toUpperCase();
                    const options = Availability_1.availableOptionsForAction(action, game.log, currentPlayer);
                    hackyOptions.set(playerId, options);
                    for (const index in options) {
                        socket.write(`[${index}]\n    ` + JSON.stringify(options[index]) + "\n");
                    }
                    socket.write("\n\n");
                }
            }
        }
        else if (request.toUpperCase().startsWith(Command.OPTION)) {
            /**
             * TAKE A SPECIFIC ACTION
             *
             * OPTION <gameId> <playerId> <option>
             */
            const matches = request.split(" ");
            if (matches.length < 4) {
                socket.write(errorMsg("OPTION <gameId> <playerId> <option>\n\n"));
            }
            else {
                const gameId = matches[1];
                const game = runningGames.get(gameId);
                const playerId = matches[2];
                try {
                    const currentPlayer = _.find((player) => playerId === player.playerId, GameInfo_1.GameInfo.players(game.log));
                    const optionIndex = parseInt(matches[3], 10);
                    if (optionIndex === undefined) {
                        socket.write(errorMsg("Option doesn't exist ....\n\n"));
                    }
                    game.actionFromOption(currentPlayer, hackyOptions.get(playerId)[optionIndex]);
                    if (GameInfo_1.GameInfo.gameOver(game.log)) {
                        broadcast(successMsg(`Game ${gameId} is over ...`), clients);
                        finishedGames.push(gameId);
                        runningGames.delete(gameId);
                        fs.writeFile(`./finished/${gameId}`, EventLogSerializer_1.EventLogSerializer.serialize(game.log), (err) => err
                            ? socket.write(errorMsg(`Failed to serialize ${gameId}\n\n`))
                            : socket.write(successMsg(`Saved game to finished/${gameId}\n\n`)));
                    }
                }
                catch (error) {
                    socket.write(errorMsg(`Something went wrong ...\n\n${error.message}\n\n`));
                }
            }
        }
        else if (request.toUpperCase().startsWith(Command.IMPORT)) {
            /**
             * IMPORT GAME STATE AND ADD TO WAITING
             *
             * IMPORT <gameId> <serializedEvents>
             */
            const matches = request.split(" ");
            const gameId = matches[1];
            const serializedEventLog = matches[2];
            if (gameId === undefined || serializedEventLog === undefined) {
                socket.write(errorMsg(`IMPORT <gameId> <serializedEvents>\n\n`));
            }
            else {
                try {
                    const log = EventLogSerializer_1.EventLogSerializer.deserialize(serializedEventLog);
                    runningGames.set(gameId, new Game_1.Game(GameInfo_1.GameInfo.players(log), log));
                    broadcast(infoMsg(`${playerUuid} imported ${gameId}`), clients);
                }
                catch (e) {
                    socket.write(`Unable to import game state\n\n${e.message}\n\n`);
                }
            }
        }
        else if (request.toUpperCase().startsWith(Command.EXPORT)) {
            /**
             * EXPORT GAME STATE
             *
             * EXPORT <gameId>
             */
            const matches = request.split(" ");
            const gameId = matches[1];
            if (gameId === undefined) {
                socket.write(errorMsg(`EXPORT <gameId>\n`));
            }
            else {
                try {
                    const game = runningGames.get(gameId);
                    socket.write(EventLogSerializer_1.EventLogSerializer.serialize(game.log) + "\n\n");
                }
                catch (e) {
                    socket.write(`Unable to export game state\n\n${e.message}\n\n`);
                }
            }
        }
        else if (request.toUpperCase().startsWith(Command.STATS)) {
            /**
             * SHOW STATS
             *
             * STATS <gameId>
             */
            const matches = request.split(" ");
            const gameId = matches[1];
            if (gameId === undefined) {
                socket.write(errorMsg(`STATS <gameId>\n`));
            }
            else {
                try {
                    const game = runningGames.get(gameId);
                    socket.write(JSON.stringify(GameInfo_1.GameInfo.stats(game.log)) + "\n\n");
                }
                catch (e) {
                    socket.write(`Unable to export stats\n\n${e.message}\n\n`);
                }
            }
        }
        else {
            socket.write(helpMessage);
        }
    });
});
const hostname = process.argv[2] ? process.argv[2] : "0.0.0.0";
const port = process.argv[3] ? parseInt(process.argv[3], 10) : 1337;
server.listen(port, hostname);
const app = express();
app.get("/load", (req, res) => {
    if (runningGames.has(req.query.gameId)) {
        const game = runningGames.get(req.query.gameId);
        const players = GameInfo_1.GameInfo.players(game.log);
        let stats = GameInfo_1.GameInfo.stats(game.log);
        stats.log = game.log.log;
        res.json(stats);
    }
});
app.use(express.static('public'));
app.listen(3000);

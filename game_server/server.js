"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const _ = require("ramda");
const Game_1 = require("../game_engine/src/Game");
const GameInfo_1 = require("../game_engine/src/GameInfo");
const Availability_1 = require("../game_engine/src/Availability");
const PlayerFactory_1 = require("../game_engine/src/PlayerFactory");
const PlayerMat_1 = require("../game_engine/src/PlayerMat");
const PlayerId_1 = require("../game_engine/src/PlayerId");
const uuid_1 = require("uuid");
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
const clients = new Map();
const waitingGames = new Map();
const runningGames = new Map();
const finishedGames = [];
const broadcast = (message, allClients) => {
    for (const [uuid, socket] of allClients) {
        socket.write(infoMsg(message));
    }
};
const infoMsg = (message) => `\n\x1b[33;01m${message}\x1b[0m\n`;
const errorMsg = (message) => `\n\x1b[31;01m${message}\x1b[0m\n`;
var Command;
(function (Command) {
    Command["WAITING"] = "WAITING";
    Command["RUNNING"] = "RUNNING";
    Command["FINISHED"] = "FINISHED";
    Command["NEW"] = "NEW";
    Command["JOIN"] = "JOIN";
    Command["START"] = "START";
    Command["ACTION"] = "ACTION";
    Command["OPTION"] = "OPTION";
})(Command || (Command = {}));
// temp hack
const hackyOptions = new Map();
const server = net.createServer((socket) => {
    const playerUuid = uuid_1.v4();
    clients.set(playerUuid, socket);
    broadcast(`${playerUuid} joined the server ...\n`, clients);
    socket.on('end', () => {
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
        }
        else if (request.toUpperCase() === Command.RUNNING) {
            /**
             * SHOW RUNNING GAMES
             */
            socket.write(JSON.stringify(Array.from(runningGames.entries())) + "\n");
        }
        else if (request.toUpperCase() === Command.FINISHED) {
            /**
             * SHOW FINISHED GAMES
             */
            socket.write(JSON.stringify(Array.from(finishedGames.entries())) + "\n");
        }
        else if (request.toUpperCase() === Command.NEW) {
            /**
             * START A NEW GAME
             */
            const gameId = uuid_1.v4();
            waitingGames.set(gameId, []);
            broadcast(`${playerUuid} opened a new game ${gameId} ...\n`, clients);
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
                const playerId = new PlayerId_1.PlayerId(playerUuid);
                const player = PlayerFactory_1.PlayerFactory.createFromString(faction, playerId, PlayerMat_1.PlayerMat.createFromString(playerMat, playerId));
                waitingGames.get(gameId).push(player);
                broadcast(`${playerUuid} joined game ${gameId} (${waitingGames.get(gameId).length} player(s)) ...\n`, clients);
            }
            catch (error) {
                socket.write(errorMsg("JOIN <gameId> <faction> <playerMat>\n"));
            }
        }
        else if (request.toUpperCase().startsWith(Command.START)) {
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
                const game = new Game_1.Game(waitingGames.get(gameId));
                waitingGames.delete(gameId);
                runningGames.set(gameId, game);
                broadcast(`${playerUuid} started game ${gameId} ...\n`, clients);
            }
            catch (error) {
                socket.write(errorMsg(`Something went wrong:\n\n${error.message}\n`));
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
            const gameId = matches[1];
            const game = runningGames.get(gameId);
            const playerId = matches[2];
            const currentPlayer = _.find((player) => playerId === player.playerId.playerId, GameInfo_1.GameInfo.players(game.log));
            if (currentPlayer === undefined) {
                socket.write(errorMsg("Player not found ...\n"));
            }
            if (matches.length === 3) {
                socket.write(Availability_1.availableTopActions(game.log, currentPlayer).join(", ") +
                    "\n" +
                    Availability_1.availableBottomActions(game.log, currentPlayer).join(", ") + "\n");
            }
            else if (matches.length === 4) {
                const action = matches[3].toUpperCase();
                const options = Availability_1.availableOptionsForAction(action, game.log, currentPlayer);
                hackyOptions.set(playerId, options);
                for (const index in options) {
                    socket.write(`[${index}]\n    ` + JSON.stringify(options[index]) + "\n");
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
                socket.write(errorMsg("OPTION <gameId> <playerId> <option>\n"));
                return;
            }
            const gameId = matches[1];
            const game = runningGames.get(gameId);
            const playerId = matches[2];
            try {
                const currentPlayer = _.find((player) => playerId === player.playerId.playerId, GameInfo_1.GameInfo.players(game.log));
                const optionIndex = parseInt(matches[3], 10);
                if (optionIndex === undefined) {
                    socket.write("Option doesn't exist ....\n");
                }
                game.actionFromOption(currentPlayer, hackyOptions.get(playerId)[optionIndex]);
                if (GameInfo_1.GameInfo.gameOver(game.log)) {
                    broadcast(`Game ${gameId} is over ...`);
                    finishedGames.push(gameId);
                    runningGames.delete(gameId);
                }
            }
            catch (error) {
                socket.write(errorMsg(`Something went wrong ...\n\n${error.message}\n`));
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const _ = require("ramda");
const Game_1 = require("../game_engine/src/Game");
const GameInfo_1 = require("../game_engine/src/GameInfo");
const Option_1 = require("../game_engine/src/Options/Option");
const Availability_1 = require("../game_engine/src/Availability");
const PlayerFactory_1 = require("../game_engine/src/PlayerFactory");
const PlayerMat_1 = require("../game_engine/src/PlayerMat");
const PlayerId_1 = require("../game_engine/src/PlayerId");
const uuid_1 = require("uuid");
const clients = new Map();
const waitingGames = new Map();
const runningGames = new Map();
const finishedGames = [];
const broadcast = (message, allClients) => {
    for (const [uuid, socket] of allClients) {
        socket.write(message);
    }
};
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
const server = net.createServer((socket) => {
    const playerUuid = uuid_1.v4();
    clients.set(playerUuid, socket);
    broadcast(`${playerUuid} joined the server ...\n`, clients);
    socket.on("data", (data) => {
        const request = data.toString().trim();
        /**
         * SHOW WAITING GAMES
         */
        if (request.toUpperCase() === Command.WAITING) {
            socket.write(JSON.stringify(Array.from(waitingGames.entries())) + "\n");
        }
        /**
         * SHOW RUNNING GAMES
         */
        if (request.toUpperCase() === Command.RUNNING) {
            socket.write(JSON.stringify(Array.from(runningGames.entries())) + "\n");
        }
        /**
         * SHOW FINISHED GAMES
         */
        if (request.toUpperCase() === Command.FINISHED) {
            socket.write(JSON.stringify(Array.from(finishedGames.entries())) + "\n");
        }
        /**
         * START A NEW GAME
         */
        if (request.toUpperCase() === Command.NEW) {
            const gameId = uuid_1.v4();
            waitingGames.set(gameId, []);
            broadcast(`${playerUuid} opened a new game ${gameId} ...\n`, clients);
        }
        /**
         * JOIN AN EXISTING GAME
         */
        if (request.toUpperCase().startsWith(Command.JOIN)) {
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
                socket.write("JOIN <gameId> <faction> <playerMat>\n");
            }
        }
        /**
         * START A GAME
         */
        if (request.toUpperCase().startsWith(Command.START)) {
            const matches = request.split(" ");
            if (matches.length < 2) {
                socket.write("START <gameId>\n");
                return;
            }
            const gameId = matches[1];
            const game = new Game_1.Game(waitingGames.get(gameId));
            waitingGames.delete(gameId);
            runningGames.set(gameId, game);
            broadcast(`${playerUuid} started game ${gameId} ...\n`, clients);
        }
        /**
         * SHOW AVAILABLE ACTIONS / SHOW OPTIONS FOR ACTION
         *
         * ACTION <gameId> <playerId>
         * ACTION <gameId> <playerId> <action>
         */
        if (request.toUpperCase().startsWith(Command.ACTION)) {
            const matches = request.split(" ");
            if (matches.length < 3) {
                socket.write("ACTION <gameId> <playerId>\n");
                socket.write("ACTION <gameId> <playerId> TRADE|BOLSTER|MOVE|PRODUCE\n");
                return;
            }
            const gameId = matches[1];
            const game = runningGames.get(gameId);
            const playerId = matches[2];
            const currentPlayer = _.find((player) => playerId === player.playerId.playerId, GameInfo_1.GameInfo.players(game.log));
            if (currentPlayer === undefined) {
                socket.write("Player not found ...\n");
            }
            if (matches.length === 3) {
                socket.write(Availability_1.availableTopActions(game.log, currentPlayer).join(", ") +
                    "\n" +
                    Availability_1.availableBottomActions(game.log, currentPlayer).join(", ") + "\n");
            }
            else if (matches.length === 4) {
                const action = matches[3].toUpperCase();
                socket.write(JSON.stringify(Availability_1.availableOptionsForAction(action, game.log, currentPlayer)) + "\n");
            }
        }
        /**
         * TAKE A SPECIFIC ACTION
         *
         * OPTION <gameId> <playerId> <option>
         */
        if (request.toUpperCase().startsWith(Command.OPTION)) {
            const matches = request.split(" ");
            if (matches.length < 4) {
                socket.write("OPTION <gameId> <playerId> <option>\n");
                return;
            }
            const gameId = matches[1];
            const game = runningGames.get(gameId);
            const playerId = matches[2];
            const currentPlayer = _.find((player) => playerId === player.playerId.playerId, GameInfo_1.GameInfo.players(game.log));
            const option = Option_1.Option.deserializeFromJsonObject(JSON.parse(matches[3]));
            game.actionFromOption(currentPlayer, option);
        }
        if (request.length === 0) {
            socket.write("Available commands: \n    " + Object.keys(Command).join("\n    ") + "\n");
        }
    });
    // socket.pipe(socket);
});
server.listen(1337, "localhost");

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const Game_1 = require("../game_engine/src/Game");
const TopAction_1 = require("../game_engine/src/TopAction");
const BottomAction_1 = require("../game_engine/src/BottomAction");
const Availability_1 = require("../game_engine/src/Availability");
const EventLog_1 = require("../game_engine/src/Events/EventLog");
const PlayerFactory_1 = require("../game_engine/src/PlayerFactory");
const PlayerMat_1 = require("../game_engine/src/PlayerMat");
const PlayerId_1 = require("../game_engine/src/PlayerId");
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["DATA"] = "data";
})(SocketEvent || (SocketEvent = {}));
const playerId1 = new PlayerId_1.PlayerId(1);
const player1 = PlayerFactory_1.PlayerFactory.black(playerId1, PlayerMat_1.PlayerMat.industrial(playerId1));
const players = [player1];
const log = new EventLog_1.EventLog();
const game = new Game_1.Game(players, log);
const server = net.createServer((socket) => {
    function printAvailableActions() {
        socket.write(Availability_1.availableTopActions(log, players, player1).join(", ") +
            "\n"
            + Availability_1.availableBottomActions(log, players, player1).join(", ") + "\n");
    }
    function printAvailableOptions(action) {
        const availableOption = Availability_1.availableOptionsForAction(action, log, player1);
        socket.write(availableOption.map((option, index) => `[${index}]` + JSON.stringify(option, null, "\t"))
            .join("\n") + "\n");
        return availableOption;
    }
    let action;
    let options = [];
    socket.on(SocketEvent.DATA, (data) => {
        const request = data.toString().trim();
        if (request in TopAction_1.TopAction) {
            action = request;
            socket.write("Choose an option:\n");
            options = printAvailableOptions(request);
        }
        else if (request in BottomAction_1.BottomAction) {
            action = request;
            socket.write("Choose an option:\n");
            options = printAvailableOptions(request);
        }
        else if (request.match(/^[0-9]+$/)) {
            console.log(options, request.trim());
            game.actionFromOption(player1, options[request.trim()]);
            socket.write("Choose an action:\n");
            printAvailableActions();
        }
        else {
            socket.write("Unknown command ... select an action, then an option ...");
            printAvailableActions();
        }
    });
    socket.pipe(socket);
});
server.listen(1337, "0.0.0.0");

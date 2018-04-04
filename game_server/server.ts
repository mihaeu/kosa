import net = require("net");
import {Game} from "../game_engine/src/Game";
import {Option} from "../game_engine/src/Options/Option";
import {TopAction} from "../game_engine/src/TopAction";
import {BottomAction} from "../game_engine/src/BottomAction";
import {availableBottomActions, availableTopActions, availableOptionsForAction} from "../game_engine/src/Availability";
import {EventLog} from "../game_engine/src/Events/EventLog";
import {PlayerFactory} from "../game_engine/src/PlayerFactory";
import {PlayerMat} from "../game_engine/src/PlayerMat";
import {PlayerId} from "../game_engine/src/PlayerId";

enum SocketEvent {
    DATA = "data",
}

const playerId1 = new PlayerId(1);
const player1 = PlayerFactory.black(playerId1, PlayerMat.industrial(playerId1));

const players = [player1];
const log = new EventLog();
const game = new Game(players, log);

const server = net.createServer((socket) => {
    function printAvailableActions() {
        socket.write(
            availableTopActions(log, players, player1).join(", ") +
            "\n"
            + availableBottomActions(log, players, player1).join(", ") + "\n",
        );
    }

    function printAvailableOptions(action: TopAction|BottomAction) {
        const availableOption = availableOptionsForAction(action, log, player1);
        socket.write(availableOption.map(
            (option: Option, index: number) => `[${index}]` + JSON.stringify(option, null, "\t"))
            .join("\n") + "\n",
        );
        return availableOption;
    }

    let action: TopAction;
    let options: Option[] = [];
    socket.on(SocketEvent.DATA, (data) => {
        const request = data.toString().trim();
        if (request in TopAction) {
            action = request;
            socket.write("Choose an option:\n");
            options = printAvailableOptions(request);
        } else if (request in BottomAction) {
            action = request;
            socket.write("Choose an option:\n");
            options = printAvailableOptions(request);
        } else if (request.match(/^[0-9]+$/)) {
            console.log(options, request.trim());
            game.actionFromOption(player1, options[request.trim()]);
            socket.write("Choose an action:\n");
            printAvailableActions();
        } else {
            socket.write("Unknown command ... select an action, then an option ...");
            printAvailableActions();
        }
    });

    socket.pipe(socket);
});

server.listen(1337, "0.0.0.0");

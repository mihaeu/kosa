import net = require('net');
import {Game} from "../game_engine/src/Game";
import {EventLog} from "../game_engine/src/Events/EventLog";
import {PlayerFactory} from "../game_engine/src/PlayerFactory";
import {PlayerMat} from "../game_engine/src/PlayerMat";
import {PlayerId} from "../game_engine/src/PlayerId";
import {BottomAction} from "../game_engine/src/BottomAction";

enum SocketEvent {
    DATA = "data"
}

const playerId1 = new PlayerId(1);
const player1 = PlayerFactory.black(playerId1, PlayerMat.industrial(playerId1));

const playerId2 = new PlayerId(2);
const player2 = PlayerFactory.white(playerId2, PlayerMat.agricultural(playerId2));

const game = new Game(new EventLog(), [player1, player2]);
const server = net.createServer((socket) => {
    socket.on(SocketEvent.DATA, (data) => {
        socket.write(game.availableTopActions(player1).join(", ") + "\n" + Object.keys(BottomAction).join(", ") + "\n");
    });
    socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
import * as bodyParser from "body-parser";
import * as express from "express";
import * as fs from "fs";
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
import { PlayerMat } from "../game_engine/src/PlayerMat";
import { UUID } from "../game_engine/src/UUID";
import ErrnoException = NodeJS.ErrnoException;

type GameUUID = UUID;
type PlayerUUID = UUID;

const waitingGames: Map<GameUUID, Player[]> = new Map();
const runningGames: Map<GameUUID, Game> = new Map();
const finishedGames: GameUUID[] = [];

// temp hack
const hackyOptions: Map<PlayerUUID, Option[]> = new Map();

if (!fs.existsSync(`${__dirname}/finished`)) {
    fs.mkdirSync(`${__dirname}/finished`);
}

const mapToJson = (x: any) => JSON.parse(JSON.stringify([...x]));

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/waiting", (req, res) => {
    res.json(mapToJson(waitingGames));
});

app.get("/running", (req, res) => {
    res.json(mapToJson(runningGames));
});

app.get("/finished", (req, res) => {
    res.json(finishedGames);
});

app.get("/new", (req, res) => {
    const gameId = v4();
    waitingGames.set(gameId, []);
    res.json(gameId);
});

app.get("/connect", (req, res) => {
    res.json(v4());
});

app.post("/join", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const playerId = req.body.playerId;
        const faction = req.body.faction.toUpperCase();
        const playerMat = req.body.playerMat.toLowerCase();
        const player = PlayerFactory.createFromString(
            faction,
            playerId,
            PlayerMat.createFromString(playerMat, playerId),
        );
        waitingGames.get(gameId).push(player);
        res.json("OK");
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

app.post("/start", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const game = new Game(waitingGames.get(gameId) as Player[]);
        waitingGames.delete(gameId);
        runningGames.set(gameId, game);
        res.json("OK");
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

app.post("/stop", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const game = runningGames.get(gameId) as Game;
        finishedGames.push(gameId);
        console.log(`${__dirname}/finished/${gameId}`);
        fs.writeFileSync(
            `${__dirname}/finished/${gameId}`,
            EventLogSerializer.serialize(game.log),
        );
        runningGames.delete(gameId);
        res.json("OK");
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

app.post("/action", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const game = runningGames.get(gameId) as Game;

        const playerId = req.body.playerId;
        const currentPlayer = _.find(
            (player: Player) => playerId === player.playerId,
            GameInfo.players(game.log),
        ) as Player;

        if (!req.body.action) {
            res.json(
                availableTopActions(game.log, currentPlayer).concat(
                    availableBottomActions(game.log, currentPlayer),
                ),
            );
        } else {
            const action = req.body.action.toUpperCase();
            const options = availableOptionsForAction(action, game.log, currentPlayer);
            hackyOptions.set(playerId, options);
            res.json(options);
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

app.post("/option", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const game = runningGames.get(gameId) as Game;

        const playerId = req.body.playerId;
        const currentPlayer = _.find(
            (player: Player) => playerId === player.playerId,
            GameInfo.players(game.log),
        ) as Player;

        const optionIndex = parseInt(req.body.option, 10);
        game.actionFromOption(currentPlayer, hackyOptions.get(playerId)[optionIndex]);

        if (GameInfo.gameOver(game.log)) {
            finishedGames.push(gameId);
            runningGames.delete(gameId);

            fs.writeFile(
                `${__dirname}/finished/${gameId}`,
                EventLogSerializer.serialize(game.log),
                (err: ErrnoException) => err,
            );
            res.status(418).json("GAME OVER")
        } else {
            res.json("OK")
        }
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

app.get("/export/:gameId", (req, res) => {
    try {
        const gameId = req.params.gameId;
        const game = runningGames.get(gameId) as Game;
        res.json(EventLogSerializer.serialize(game.log));
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

app.post("/import", (req, res) => {
    const gameId = req.body.gameId;
    const serializedEventLog = req.body.log;
    try {
        const log = EventLogSerializer.deserialize(serializedEventLog);
        runningGames.set(gameId, new Game(GameInfo.players(log), log));
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

app.get("/stats/:gameId", (req, res) => {
    const gameId = req.params.gameId;
    if (gameId === undefined || !runningGames.has(gameId)) {
        res.status(500).json({message: "gameId unknown"});
    } else {
        try {
            const game = runningGames.get(gameId) as Game;
            res.json(GameInfo.stats(game.log));
        } catch (e) {
            res.status(500).json({message: e.message});
        }
    }
});

const readFinishedGameLog = (gameId: UUID) => {
    const serializedEventLog = fs.readFileSync(`${__dirname}/finished/${gameId}`).toString();
    return EventLogSerializer.deserialize(serializedEventLog);
};

app.get("/load", (req, res) => {
    const gameId = req.query.gameId;
    if (!gameId) {
        res.status(500).json({message: "gameId required"});
        return;
    }

    try {
        const log = runningGames.has(gameId)
            ? runningGames.get(gameId).log
            : readFinishedGameLog(gameId);

        if (!log) {
            res.status(500).json({message: "Unable to load game"});
            return;
        }
        const players = GameInfo.players(log);
        let stats = GameInfo.stats(log);
        stats.log = log.log;
        res.json(stats);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

app.use((req, res) => {
    res.send(404);
});

const hostname = process.argv[2] ? process.argv[2] : "0.0.0.0";
const port = process.argv[3] ? parseInt(process.argv[3], 10) : 3000;
app.listen(port, hostname);

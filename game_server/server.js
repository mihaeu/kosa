"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const _ = require("ramda");
const uuid_1 = require("uuid");
const Availability_1 = require("../game_engine/src/Availability");
const EventLogSerializer_1 = require("../game_engine/src/Events/EventLogSerializer");
const Game_1 = require("../game_engine/src/Game");
const GameInfo_1 = require("../game_engine/src/GameInfo");
const PlayerFactory_1 = require("../game_engine/src/PlayerFactory");
const PlayerMat_1 = require("../game_engine/src/PlayerMat");
const waitingGames = new Map();
const runningGames = new Map();
const finishedGames = [];
// temp hack
const hackyOptions = new Map();
if (!fs.existsSync(`${__dirname}/finished`)) {
    fs.mkdirSync(`${__dirname}/finished`);
}
const mapToJson = (x) => JSON.parse(JSON.stringify([...x]));
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
    const gameId = uuid_1.v4();
    waitingGames.set(gameId, []);
    res.json(gameId);
});
app.get("/connect", (req, res) => {
    res.json(uuid_1.v4());
});
app.post("/join", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const playerId = req.body.playerId;
        const faction = req.body.faction.toUpperCase();
        const playerMat = req.body.playerMat.toLowerCase();
        const player = PlayerFactory_1.PlayerFactory.createFromString(faction, playerId, PlayerMat_1.PlayerMat.createFromString(playerMat, playerId));
        waitingGames.get(gameId).push(player);
        res.json("OK");
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
app.post("/start", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const game = new Game_1.Game(waitingGames.get(gameId));
        waitingGames.delete(gameId);
        runningGames.set(gameId, game);
        res.json("OK");
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
app.post("/stop", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const game = runningGames.get(gameId);
        finishedGames.push(gameId);
        console.log(`${__dirname}/finished/${gameId}`);
        fs.writeFileSync(`${__dirname}/finished/${gameId}`, EventLogSerializer_1.EventLogSerializer.serialize(game.log));
        runningGames.delete(gameId);
        res.json("OK");
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
app.post("/action", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const game = runningGames.get(gameId);
        const playerId = req.body.playerId;
        const currentPlayer = _.find((player) => playerId === player.playerId, GameInfo_1.GameInfo.players(game.log));
        if (!req.body.action) {
            res.json(Availability_1.availableTopActions(game.log, currentPlayer).concat(Availability_1.availableBottomActions(game.log, currentPlayer)));
        }
        else {
            const action = req.body.action.toUpperCase();
            const options = Availability_1.availableOptionsForAction(action, game.log, currentPlayer);
            hackyOptions.set(playerId, options);
            res.json(options);
        }
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
app.post("/option", (req, res) => {
    try {
        const gameId = req.body.gameId;
        const game = runningGames.get(gameId);
        const playerId = req.body.playerId;
        const currentPlayer = _.find((player) => playerId === player.playerId, GameInfo_1.GameInfo.players(game.log));
        const optionIndex = parseInt(req.body.option, 10);
        game.actionFromOption(currentPlayer, hackyOptions.get(playerId)[optionIndex]);
        if (GameInfo_1.GameInfo.gameOver(game.log)) {
            finishedGames.push(gameId);
            runningGames.delete(gameId);
            fs.writeFile(`${__dirname}/finished/${gameId}`, EventLogSerializer_1.EventLogSerializer.serialize(game.log), (err) => err);
            res.status(418).json("GAME OVER");
        }
        else {
            res.json("OK");
        }
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
app.get("/export/:gameId", (req, res) => {
    try {
        const gameId = req.params.gameId;
        const game = runningGames.get(gameId);
        res.json(EventLogSerializer_1.EventLogSerializer.serialize(game.log));
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
app.post("/import", (req, res) => {
    const gameId = req.body.gameId;
    const serializedEventLog = req.body.log;
    try {
        const log = EventLogSerializer_1.EventLogSerializer.deserialize(serializedEventLog);
        runningGames.set(gameId, new Game_1.Game(GameInfo_1.GameInfo.players(log), log));
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
app.get("/stats/:gameId", (req, res) => {
    const gameId = req.params.gameId;
    if (gameId === undefined || !runningGames.has(gameId)) {
        res.status(500).json({ message: "gameId unknown" });
    }
    else {
        try {
            const game = runningGames.get(gameId);
            res.json(GameInfo_1.GameInfo.stats(game.log));
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
});
const readFinishedGameLog = (gameId) => {
    const serializedEventLog = fs.readFileSync(`${__dirname}/finished/${gameId}`).toString();
    return EventLogSerializer_1.EventLogSerializer.deserialize(serializedEventLog);
};
app.get("/load", (req, res) => {
    const gameId = req.query.gameId;
    if (!gameId) {
        res.status(500).json({ message: "gameId required" });
        return;
    }
    try {
        const log = runningGames.has(gameId)
            ? runningGames.get(gameId).log
            : readFinishedGameLog(gameId);
        if (!log) {
            res.status(500).json({ message: "Unable to load game" });
            return;
        }
        const players = GameInfo_1.GameInfo.players(log);
        let stats = GameInfo_1.GameInfo.stats(log);
        stats.log = log.log;
        res.json(stats);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
app.use((req, res) => {
    res.send(404);
});
const hostname = process.argv[2] ? process.argv[2] : "0.0.0.0";
const port = process.argv[3] ? parseInt(process.argv[3], 10) : 3000;
app.listen(port, hostname);

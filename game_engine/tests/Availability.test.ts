import { availableBolsterOptions } from "../src/Availability";
import { EventLog } from "../src/Events/EventLog";
import { Game } from "../src/Game";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";

let game: Game;

const blackIndustrialPlayerId = new PlayerId(1);
const greenAgriculturalPlayerId = new PlayerId(2);

const blackIndustrialPlayer = PlayerFactory.black(
    blackIndustrialPlayerId,
    PlayerMat.industrial(blackIndustrialPlayerId),
);

const greenAgriculturalPlayer = PlayerFactory.green(
    greenAgriculturalPlayerId,
    PlayerMat.agricultural(greenAgriculturalPlayerId),
);
const testPlayers = [blackIndustrialPlayer, greenAgriculturalPlayer];

let log: EventLog;

beforeEach(() => {
    log = new EventLog();
    game = new Game([blackIndustrialPlayer, greenAgriculturalPlayer], log);
});

describe("Options", () => {
    test("If player can bolster there are two options", () => {
        expect(availableBolsterOptions(log, blackIndustrialPlayer).length).toBe(2);
    });

    test("If player cannot bolster there no options", () => {
        game.bolsterPower(blackIndustrialPlayer);
        expect(availableBolsterOptions(log, blackIndustrialPlayer).length).toBe(0);
    });
});

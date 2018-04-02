import { availableBolsterOptions, availableProduceOptions, availableTradeOptions } from "../src/Availability";
import { DeployEvent } from "../src/Events/DeployEvent";
import { EventLog } from "../src/Events/EventLog";
import { MoveEvent } from "../src/Events/MoveEvent";
import { Field } from "../src/Field";
import { Game } from "../src/Game";
import { ProduceOption } from "../src/Options/ProduceOption";
import { PlayerFactory } from "../src/PlayerFactory";
import { PlayerId } from "../src/PlayerId";
import { PlayerMat } from "../src/PlayerMat";
import { Worker } from "../src/Units/Worker";

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
    describe("Bolster", () => {
        test("If player can bolster there are two options", () => {
            expect(availableBolsterOptions(log, blackIndustrialPlayer).length).toBe(2);
        });

        test("If player cannot bolster there no options", () => {
            game.bolsterPower(blackIndustrialPlayer);
            expect(availableBolsterOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });

    describe("Trade", () => {
        test("If player can bolster there are two options", () => {
            expect(availableTradeOptions(log, blackIndustrialPlayer).length).toBe(17);
        });

        test("If player cannot bolster there no options", () => {
            game.tradePopularity(blackIndustrialPlayer);
            expect(availableTradeOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });

    describe("Produce", () => {
        test("If player has workers on one field there is only one option with one field", () => {
            game.log.add(new MoveEvent(blackIndustrialPlayerId, Worker.WORKER_1, Field.t8));
            expect(availableProduceOptions(log, blackIndustrialPlayer).pop()).toEqual(new ProduceOption([Field.t8]));
        });

        test("If player has workers on two fields there is only one option with two fields", () => {
            expect(availableProduceOptions(log, blackIndustrialPlayer).pop()).toEqual(
                new ProduceOption([Field.m6, Field.t8]),
            );
        });

        test("If player has workers on three fields there are three options", () => {
            game.log.add(new DeployEvent(blackIndustrialPlayerId, Worker.WORKER_3, Field.v6));
            expect(availableProduceOptions(log, blackIndustrialPlayer)).toEqual([
                new ProduceOption([Field.m6, Field.t8]),
                new ProduceOption([Field.m6, Field.v6]),

                new ProduceOption([Field.t8, Field.v6]),
            ]);
        });

        test("If player cannot produce there no options", () => {
            game.produce(blackIndustrialPlayer, Field.m6, Field.t8);
            expect(availableProduceOptions(log, blackIndustrialPlayer).length).toBe(0);
        });
    });
});

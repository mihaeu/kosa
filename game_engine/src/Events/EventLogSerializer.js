"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionEvent_1 = require("./ActionEvent");
const BuildEvent_1 = require("./BuildEvent");
const CoinEvent_1 = require("./CoinEvent");
const GainCombatCardEvent_1 = require("./GainCombatCardEvent");
const DeployEvent_1 = require("./DeployEvent");
const EnlistEvent_1 = require("./EnlistEvent");
const EventLog_1 = require("./EventLog");
const GainResourceEvent_1 = require("./GainResourceEvent");
const GameEndEvent_1 = require("./GameEndEvent");
const LocationEvent_1 = require("./LocationEvent");
const MoveEvent_1 = require("./MoveEvent");
const NewPlayerEvent_1 = require("./NewPlayerEvent");
const PassEvent_1 = require("./PassEvent");
const PopularityEvent_1 = require("./PopularityEvent");
const PowerEvent_1 = require("./PowerEvent");
const ResourceEvent_1 = require("./ResourceEvent");
const SpendResourceEvent_1 = require("./SpendResourceEvent");
const StarEvent_1 = require("./StarEvent");
const UpgradeEvent_1 = require("./UpgradeEvent");
class EventLogSerializer {
    static serialize(eventLog) {
        const jsonEvents = [];
        for (const event of eventLog.log) {
            // @ts-ignore - this type doesn't exist because we assign it dynamically on purpose
            event.type = event.constructor.name;
            jsonEvents.push(JSON.stringify(event));
        }
        return jsonEvents.join("\n");
    }
    static deserialize(serializedEventLog) {
        const log = [];
        for (const serializedEvent of serializedEventLog.split("\n")) {
            const deserializedJson = JSON.parse(serializedEvent);
            const eventType = EventLogSerializer.dynamicClassLookup(deserializedJson.type);
            try {
                const event = new eventType();
                log.push(Object.assign(event, deserializedJson));
            }
            catch (error) {
                console.error(`Unable to deserialize ${deserializedJson}. Check if the class is supported.`);
                throw error;
            }
        }
        return new EventLog_1.EventLog(log);
    }
    static dynamicClassLookup(type) {
        return this.EVENT_CLASSES[type];
    }
}
EventLogSerializer.EVENT_CLASSES = {
    ActionEvent: ActionEvent_1.ActionEvent,
    BuildEvent: BuildEvent_1.BuildEvent,
    CoinEvent: CoinEvent_1.CoinEvent,
    DeployEvent: DeployEvent_1.DeployEvent,
    EnlistEvent: EnlistEvent_1.EnlistEvent,
    GainCombatCardEvent: GainCombatCardEvent_1.GainCombatCardEvent,
    GainResourceEvent: GainResourceEvent_1.GainResourceEvent,
    GameEndEvent: GameEndEvent_1.GameEndEvent,
    LocationEvent: LocationEvent_1.LocationEvent,
    MoveEvent: MoveEvent_1.MoveEvent,
    NewPlayerEvent: NewPlayerEvent_1.NewPlayerEvent,
    PassEvent: PassEvent_1.PassEvent,
    PopularityEvent: PopularityEvent_1.PopularityEvent,
    PowerEvent: PowerEvent_1.PowerEvent,
    ResourceEvent: ResourceEvent_1.ResourceEvent,
    SpendResourceEvent: SpendResourceEvent_1.SpendResourceEvent,
    StarEvent: StarEvent_1.StarEvent,
    UpgradeEvent: UpgradeEvent_1.UpgradeEvent,
};
exports.EventLogSerializer = EventLogSerializer;

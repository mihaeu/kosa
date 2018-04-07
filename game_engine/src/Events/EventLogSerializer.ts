import { ActionEvent } from "./ActionEvent";
import { BuildEvent } from "./BuildEvent";
import { CoinEvent } from "./CoinEvent";
import { DeployEvent } from "./DeployEvent";
import { EnlistEvent } from "./EnlistEvent";
import { Event } from "./Event";
import { EventLog } from "./EventLog";
import { GainCombatCardEvent } from "./GainCombatCardEvent";
import { GainResourceEvent } from "./GainResourceEvent";
import { GameEndEvent } from "./GameEndEvent";
import { LocationEvent } from "./LocationEvent";
import { MoveEvent } from "./MoveEvent";
import { NewPlayerEvent } from "./NewPlayerEvent";
import { PassEvent } from "./PassEvent";
import { PopularityEvent } from "./PopularityEvent";
import { PowerEvent } from "./PowerEvent";
import { ResourceEvent } from "./ResourceEvent";
import { SpendResourceEvent } from "./SpendResourceEvent";
import { StarEvent } from "./StarEvent";
import { UpgradeEvent } from "./UpgradeEvent";

export class EventLogSerializer {
    public static serialize(eventLog: EventLog): string {
        const jsonEvents = [];
        for (const event of eventLog.log) {
            // @ts-ignore - this type doesn't exist because we assign it dynamically on purpose
            event.type = event.constructor.name;
            jsonEvents.push(JSON.stringify(event));
        }
        return jsonEvents.join("\n");
    }

    public static deserialize(serializedEventLog: string): EventLog {
        const log: Event[] = [];
        for (const serializedEvent of serializedEventLog.split("\n")) {
            const deserializedJson = JSON.parse(serializedEvent);
            const eventType = EventLogSerializer.dynamicClassLookup(deserializedJson.type);
            const event = new eventType();
            log.push((Object as any).assign(event, deserializedJson));
        }
        return new EventLog(log);
    }

    private static EVENT_CLASSES: any = {
        ActionEvent,
        BuildEvent,
        CoinEvent,
        DeployEvent,
        EnlistEvent,
        GainCombatCardEvent,
        GainResourceEvent,
        GameEndEvent,
        LocationEvent,
        MoveEvent,
        NewPlayerEvent,
        PassEvent,
        PopularityEvent,
        PowerEvent,
        ResourceEvent,
        SpendResourceEvent,
        StarEvent,
        UpgradeEvent,
    };

    private static dynamicClassLookup(type: string): any {
        return this.EVENT_CLASSES[type];
    }
}

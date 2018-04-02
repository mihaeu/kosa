import { ResourceType } from "../ResourceType";
import { Option } from "./Option";

export class TradeResourcesOption extends Option {
    constructor(public readonly resource1: ResourceType, public readonly resource2: ResourceType) {
        super();
    }
}

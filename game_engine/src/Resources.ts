import {ResourceType} from "./ResourceType";

export class Resources {
    constructor(
        public readonly metal: number = 0,
        public readonly food: number = 0,
        public readonly oil: number = 0,
        public readonly wood: number = 0,
    ) {}

    public countByType(type: ResourceType): number {
        switch (type) {
            case ResourceType.METAL:
                return this.metal;
            case ResourceType.FOOD:
                return this.food;
            case ResourceType.OIL:
                return this.oil;
            case ResourceType.WOOD:
                return this.wood;
        }
    }
}

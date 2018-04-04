"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Building {
    constructor(building, location) {
        this.building = building;
        this.location = location;
    }
    static fromEvent(event) {
        return new Building(event.building, event.location);
    }
}
exports.Building = Building;

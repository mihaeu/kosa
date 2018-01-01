export class Unit {
    protected constructor(public readonly name: string) {}

    public toString(): String {
        return this.name;
    }
}

export class Unit {
    protected constructor(public readonly name: string) {}

    public toString(): string {
        return this.name;
    }
}

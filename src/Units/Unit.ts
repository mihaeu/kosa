export class Unit {
    protected constructor(public readonly name: string, public readonly deployed: boolean = false) {}

    public toString(): String {
        return  `${this.name}:${this.deployed ? 'deployed' : 'not deployed'}`;
    }
}

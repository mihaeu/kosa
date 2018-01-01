export class Unit {
    public static readonly CHARACTER = new Unit("CHARACTER", true);
    public static readonly MECH_1 = new Unit("MECH_1");
    public static readonly MECH_2 = new Unit("MECH_2");
    public static readonly MECH_3 = new Unit("MECH_3");
    public static readonly MECH_4 = new Unit("MECH_4");
    public static readonly WORKER_1 = new Unit("WORKER_1", true);
    public static readonly WORKER_2 = new Unit("WORKER_2", true);
    public static readonly WORKER_3 = new Unit("WORKER_3");
    public static readonly WORKER_4 = new Unit("WORKER_4");
    public static readonly WORKER_5 = new Unit("WORKER_5");
    public static readonly WORKER_6 = new Unit("WORKER_6");
    public static readonly WORKER_7 = new Unit("WORKER_7");
    public static readonly WORKER_8 = new Unit("WORKER_8");

    private constructor(public readonly name: string, public readonly deployed: boolean = false) {}

    public toString(): String {
        return  `${this.name}:${this.deployed ? 'deployed' : 'not deployed'}`;
    }
}

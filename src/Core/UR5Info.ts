export class UR5Info {
    constructor() {
        this.sector = [];
        this.analogInputRange = [];
        this.analogIn = [];
        for (let i = 0; i != 6; i++) {
            this.sector.push(new URJointSector(i));
        }
        for (let i = 0; i != 8; i++) {
            this.analogInputRange.push(0);
        }
        for (let i = 0; i != 8; i++) {
            this.analogIn.push(0);
        }
    }
    // id: 0
    public timestamp: number;
    public physical: boolean;
    public real: boolean;
    public robotPowerOn: boolean;
    public emergencyStopped: boolean;
    public securityStopped: boolean;
    public programRunning: boolean;
    public programPaused: boolean;
    public mode: number;
    public speedFraction: number;
    //id: 1
    public sector: Array<URJointSector>;
    //id: 2
    public analogInputRange: Array<number>;
    public analogIn: Array<number>;
    public toolVoltage48V: number;
    public toolOutputVoltage: number;
    public toolCurrent: number;
    public toolTemperature: number;
    public toolMode: number;
    //id:4
    public ToolPosition: URToolPosition = new URToolPosition();
    public ToolOrientation: URToolOrientation = new URToolOrientation();
}

export class URJointSector {
    constructor(codeId: number) {
        this.CodeID = codeId;
    }
    public CodeID: number;

    public Mode: number;
    public MicroTemperature: number;
    public MotorTemperature: number;
    public Voltage: number;
    public JointCurrent: number;
    public JointTarger: number;
    public JointPosition: number;
    public JointSpeed: number;
}

export class URToolPosition {
    public X: number;
    public Y: number;
    public Z: number;
}
export class URToolOrientation {
    public X: number;
    public Y: number;
    public Z: number;
}
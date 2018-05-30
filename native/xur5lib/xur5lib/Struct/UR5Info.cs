namespace UR5.Struct
{
    using System;
    using System.Collections.Generic;

    public class UR5Info
    {
        public long TimeStamp { get;set; }


        public bool IsReal { get; set; }
        public bool IsPhysical { get; set; }
        public bool IsPowerOn { get; set; }

        public bool IsEmergencyStopped { get; set; }
        public bool IsSecurityStopped { get; set; }

        public bool IsProgramWork { get; set; }
        public bool IsProgramPaused { get; set; }

        public RobotMode Mode { get; set; }

        public ToolTransform ToolPosition = new ToolTransform();
        public ToolTransform ToolOrientation = new ToolTransform() { IsRotate = true };

        public List<Joint> Joints = new List<Joint>(6)
        {
            new Joint(JointType.Base), 
            new Joint(JointType.Shoulder),
            new Joint(JointType.Elbow), 
            new Joint(JointType.Wrist1), 
            new Joint(JointType.Wrist2), 
            new Joint(JointType.Wrist3)
        };


    }
    public enum JointType
    {
        Base,
        Shoulder,
        Elbow,
        Wrist1,
        Wrist2,
        Wrist3
    }
    public class Joint
    {
        public Joint(JointType type)
        {
            CodeID = type;
        }
        public JointType CodeID { get; set; }

        public int Mode;
        public float MicroTemperature;
        public float MotorTemperature;
        public float Voltage;
        public float JointCurrent;
        public double JointTarger;
        public double JointPosition;
        public float DegreePosition => (float)Math.Round(JointPosition * 180 / Math.PI, 2);
        public double JointSpeed;
    }

    public class ToolTransform
    {
        public bool IsRotate { get; set; }

        public double X, Y, Z;
    }
}

/* 
    public sector: Array<URJointSector>;
    //id: 2
    public analogInputRange: Array<number>;
    public analogIn: Array<number>;
    public toolVoltage48V: number;
    public toolOutputVoltage: number;
    public toolCurrent: number;
    public toolTemperature: number;
    public toolMode: number;
    //id:3
    public masterTemperature: number;
    public robotVoltage48V: number;
    public robotCurrent: number;
    public masterIOCurrent: number;

    public masterSafetyState: number; // byte
    public masterOnOffState: number; // byte

    //id:4
    public ToolPosition: URToolPosition = new URToolPosition();
    public ToolOrientation: URToolOrientation = new URToolOrientation();

    //id:7
    public Dexterity: number;

    //id:8
    public teachButtonPressed: boolean;
    public teachButtonEnabled: boolean;
*/


/*export class URJointSector {
constructor(codeId: number) {
    this.CodeID = codeId;
}
public CodeID: number;



public SetJointPosition(value: number): void {
    this.JointPosition = value;
    this.DegreePosition = +(URMath.Round((this.JointPosition * 180 / Math.PI), 2));
}
//id: 7 
public force_mode_frame: number;
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
}*/

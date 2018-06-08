/*
 public static final int JOINT_MODE_BAR = 237;
    public static final int JOINT_PART_D_CALIBRATION_MODE = 237;
    public static final int JOINT_BACKDRIVE_MODE = 238;
    public static final int JOINT_POWER_OFF_MODE = 239;
    public static final int JOINT_EMERGENCY_STOPPED_MODE = 240;
    public static final int JOINT_CALVAL_INITIALIZATION_MODE = 241;
    public static final int JOINT_ERROR_MODE = 242;
    public static final int JOINT_FREEDRIVE_MODE = 243;
    public static final int JOINT_SIMULATED_MODE = 244;
    public static final int JOINT_NOT_RESPONDING_MODE = 245;
    public static final int JOINT_MOTOR_INITIALISATION_MODE = 246;
    public static final int JOINT_ADC_CALIBRATION_MODE = 247;
    public static final int JOINT_DEAD_COMMUTATION_MODE = 248;
    public static final int JOINT_BOOTLOADER_MODE = 249;
    public static final int JOINT_CALIBRATION_MODE = 250;
    public static final int JOINT_STOPPED_MODE = 251;
    public static final int JOINT_FAULT_MODE = 252;
    public static final int JOINT_RUNNING_MODE = 253;
    public static final int JOINT_INITIALIZATION_MODE = 254;
    public static final int JOINT_IDLE_MODE = 255;
    public static final int GREEN_STATUS_LEVEL = 0;
    public static final int YELLOW_STATUS_LEVEL = 1;
    public static final int RED_STATUS_LEVEL = 2;
    public static final int GRAY_STATUS_LEVEL = 3;
*/


export enum JointModes {
    IDLE = 255,
    RUNNING = 253,
    STOPPED = 251,
    POWER_OFF = 239,
    BACKDRIVE = 238,

    BOOTLOADER = 249,
    MODE_BAR = 237,


    SIMULATED = 244,
    FREEDRIVE = 243,


    ADC_CALIBRATION = 247,
    CALIBRATION = 250,
    PART_D_CALIBRATION = 247,


    MOTOR_INITIALISATION = 246,
    CALVAL_INITIALIZATION = 241,
    INITIALIZATION = 254,

    NOT_RESPONDING = 245,
    EMERGENCY_STOPPED = 240,

    DEAD_COMMUTATION = 248,
    FAULT = 252,
    ERROR = 242,
}

export class Motor {
    public static getStatusLevel(mode: JointModes) {
        switch (mode) {
            case 238:
            case 244:
            case 251:
            case 253: {
                return 0;
            }
            case 242:
            case 252: {
                return 2;
            }
            case 245: {
                return 3;
            }
        }
        return 1;
    }
}
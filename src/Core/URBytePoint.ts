/**
 *  Byte shifts to point to the right byte data inside a packet
 */
export enum URBytePoint {
    GET_MESSAGE_TYPE = 4,
    GET_TIME = 1,
    // Real Joint Position
    GET_JOINT_POSITIONS = 252,
    // Real Joint Speeds
    GET_JOINT_SPEEDS = 300,
    GET_JOINT_CURRENTS = 348,
    GET_TCP_FORCES = 540,
    // Real TCP position
    GET_TCP_POSITION = 444,
    // Real TCP speed
    GET_TCP_SPEED = 492
}


// 1,1,1,1,0,0,0,5,63,240,0,0,0,0,0,0,0,0,0,251,1,192,0,129,131,135,133,210,254,192,0,129,137,55,75,199,25,0,0,0,0,0,0,0,0,190
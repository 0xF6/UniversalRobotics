import { Socket } from "net";
import { URMath } from './math';
import { Config } from './config';

let host: string = Config.UR_IP;
let port: number = Config.UR_Port;

const socket = new Socket();

socket.connect(port, host);
console.log("PlatformR Client has been started.");

socket.on('connect', () => {
    console.log("Connected.");
});
socket.on('data', data => {

    if (!UR5.packet_check(data)) {
        console.log("dropped packet");
        return;
    }
    let arew = UR5.on_packet(data);
    console.log(JSON.stringify(arew));
});
socket.on('disconnect', () => {
    console.log("Disconnect.");
});

// 1,1,1,1,0,0,0,5,63,240,0,0,0,0,0,0,0,0,0,251,1,192,0,129,131,135,133,210,254,192,0,129,137,55,75,199,25,0,0,0,0,0,0,0,0,190


/**
 *  Byte shifts to point to the right byte data inside a packet
 */
enum URBytePoint {
    GET_TIME = 1,
    GET_JOINT_POSITIONS = 252,
    GET_JOINT_SPEEDS = 300,
    GET_JOINT_CURRENTS = 348,
    GET_TCP_FORCES = 540
}

class UR5 {
    public static Obj = { JOINTS: "", robot_current: 0, forces_tcp: [0] }
    /**
     * Action to take when a new packet arrives
     * @param buff packet buffer
     */
    public static on_packet(packet: Buffer) {
        let ROBOT_JOINTS = new Array<number>();

        let RAD = UR5.packet_value(packet, <number>URBytePoint.GET_JOINT_POSITIONS);

        for (let dv of RAD) {
            ROBOT_JOINTS.push(URMath.Round(dv * 180 / Math.PI, 5));
        }

        let speed = UR5.packet_value(packet, <number>URBytePoint.GET_JOINT_SPEEDS);
        let robot_current = UR5.packet_value(packet, <number>URBytePoint.GET_JOINT_CURRENTS);
        let forces_tcp = UR5.packet_value(packet, <number>URBytePoint.GET_TCP_FORCES);

        return { Speed: speed, TCPForce: forces_tcp, R_A_D: ROBOT_JOINTS };
    }

    public static auto_round(arr: Array<number>): Array<number> {
        let awre = [];
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            awre.push(URMath.Round(element, 5));
        }
        return awre;
    }

    /**
     * Get specific information from a packet
     * @param buff packet buffer
     * @param offset packet offset
     * @param nval target conunt bytes
     */
    public static packet_value(buff: Buffer, offset: number, nval: number = 6, is_auto_round: boolean = true): Array<number> {
        if (buff.length < offset + nval) {
            console.log(`Not available offset (maybe older Polyscope version?): ${buff.length} - ${offset}`)
            return undefined;
        }
        let list = new Array<number>();
        for (let o = 0; o !== nval; o++) {
            list.push(buff.readDoubleBE(offset));
        }

        if (is_auto_round)
            return this.auto_round(list);
        return list;
    }

    /**
     * Get packet size according to the byte array
     * @param buff packet
     */
    public static packet_size(buff: Buffer): number {
        if (buff.length < 4)
            return 0;
        return buff.readInt32BE(0);
    }
    /**
     * Check if a packet is complete
     * @param buff packet
     */
    public static packet_check(buff: Buffer): boolean {
        let msg_size: number = this.packet_size(buff);

        if (buff.length < msg_size) {
            console.log(`Incorrect packet size ${msg_size} vs ${buff.length}`);
            return false;
        }
        return true;
    }
}
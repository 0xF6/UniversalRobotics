import { URBytePoint } from "./URBytePoint";
import { Logger } from "../Tools/Logger";
import { URMath } from "../Tools/URMath";

export class URCore {
    public static Obj = { JOINTS: "", robot_current: 0, forces_tcp: [0] }
    /**
     * Action to take when a new packet arrives
     * @param buff packet buffer
     */
    public static on_packet(packet: Buffer) {
        let msgType = URCore.read_message_type(packet); // byte op code


        switch (msgType) {
            case -1:
                Logger.Error("case disconnect.");
                process.exit(-1);
                break;
            case 5:
                Logger.Log("Modbus error");
                break;
            case 16: // normal packet
                break;
        }


        let ROBOT_JOINTS = new Array<number>();

        let RAD = URCore.packet_value(packet, <number>URBytePoint.GET_JOINT_POSITIONS);

        for (let dv of RAD) {
            ROBOT_JOINTS.push(URMath.Round(dv * 180 / Math.PI, 5));
        }

        let speed = URCore.packet_value(packet, <number>URBytePoint.GET_JOINT_SPEEDS);
        let robot_current = URCore.packet_value(packet, <number>URBytePoint.GET_JOINT_CURRENTS);
        let forces_tcp = URCore.packet_value(packet, <number>URBytePoint.GET_TCP_FORCES);

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
            Logger.Error(`Not available offset (maybe older Polyscope version?): ${buff.length} - ${offset}`)
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

    public static read_message_type(buff: Buffer): number {
        if (buff.length < 5) {
            Logger.Error(`Not available offset (maybe older Polyscope version?): ${buff.length} - 4`)
            return undefined;
        }
        return buff[4];
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
            Logger.Error(`Incorrect packet size ${msg_size} vs ${buff.length}`);
            return false;
        }
        return true;
    }
}
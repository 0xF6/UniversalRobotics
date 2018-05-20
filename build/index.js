"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const math_1 = require("./math");
let host = "192.168.4.247";
let port = 30002;
const socket = new net_1.Socket();
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
var URBytePoint;
(function (URBytePoint) {
    URBytePoint[URBytePoint["GET_TIME"] = 1] = "GET_TIME";
    URBytePoint[URBytePoint["GET_JOINT_POSITIONS"] = 252] = "GET_JOINT_POSITIONS";
    URBytePoint[URBytePoint["GET_JOINT_SPEEDS"] = 300] = "GET_JOINT_SPEEDS";
    URBytePoint[URBytePoint["GET_JOINT_CURRENTS"] = 348] = "GET_JOINT_CURRENTS";
    URBytePoint[URBytePoint["GET_TCP_FORCES"] = 540] = "GET_TCP_FORCES";
})(URBytePoint || (URBytePoint = {}));
class UR5 {
    /**
     * Action to take when a new packet arrives
     * @param buff packet buffer
     */
    static on_packet(packet) {
        let ROBOT_JOINTS = new Array();
        let RAD = UR5.packet_value(packet, URBytePoint.GET_JOINT_POSITIONS);
        for (let dv of RAD) {
            ROBOT_JOINTS.push(math_1.URMath.Round(dv * 180 / Math.PI, 5));
        }
        let speed = UR5.packet_value(packet, URBytePoint.GET_JOINT_SPEEDS);
        let robot_current = UR5.packet_value(packet, URBytePoint.GET_JOINT_CURRENTS);
        let forces_tcp = UR5.packet_value(packet, URBytePoint.GET_TCP_FORCES);
        return { Speed: speed, TCPForce: forces_tcp, R_A_D: ROBOT_JOINTS };
    }
    static auto_round(arr) {
        let awre = [];
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            awre.push(math_1.URMath.Round(element, 5));
        }
        return awre;
    }
    /**
     * Get specific information from a packet
     * @param buff packet buffer
     * @param offset packet offset
     * @param nval target conunt bytes
     */
    static packet_value(buff, offset, nval = 6, is_auto_round = true) {
        if (buff.length < offset + nval) {
            console.log(`Not available offset (maybe older Polyscope version?): ${buff.length} - ${offset}`);
            return undefined;
        }
        let list = new Array();
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
    static packet_size(buff) {
        if (buff.length < 4)
            return 0;
        return buff.readInt32BE(0);
    }
    /**
     * Check if a packet is complete
     * @param buff packet
     */
    static packet_check(buff) {
        let msg_size = this.packet_size(buff);
        if (buff.length < msg_size) {
            console.log(`Incorrect packet size ${msg_size} vs ${buff.length}`);
            return false;
        }
        return true;
    }
}
UR5.Obj = { JOINTS: "", robot_current: 0, forces_tcp: [0] };
//# sourceMappingURL=index.js.map
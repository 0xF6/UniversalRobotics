import { URBytePoint } from "./URBytePoint";
import { Logger } from "../Tools/Logger";
import { URMath } from "../Tools/URMath";
import { UR5Info } from "./UR5Info";
import * as Enumerable from "linq";

export class URCore {
    public static PacketID: number = 0;
    public static IsMove: boolean;
    /**
     * Action to take when a new packet arrives
     * @param buff packet buffer
     */
    public static on_packet(packet: Buffer): UR5Info {

        URCore.PacketID++;
        if (URCore.PacketID % 5 != 0) // Record once every 5 packets (125/5=25 Hz)
            return undefined;

        let base: UR5Info = new UR5Info();
        let offset = 0;
        let size_packet = URCore.packet_size(packet);
        offset += 4; // int32
        let msgType = URCore.read_message_type(packet); // byte op code
        offset++; // byte
        switch (msgType) {
            case -1:
                Logger.Error("case disconnect.");
                process.exit(-1);
                break;
            case 5:
                Logger.Log("Modbus error");
                // TODO
                break;
            case 16: // normal packet
                while (offset < size_packet) {

                    let packet_start = offset;
                    let packageLength = packet.readInt32BE(offset);
                    offset += 4;
                    let packet_type = packet.readByteBE(offset);
                    offset++;
                    //Logger.Warn(`Package type: ${packet_type}`);
                    switch (packet_type) {
                        case 0:
                            {
                                base.timestamp = packet.readInt64BE(offset);
                                offset += 8;
                                base.physical = packet.readBooleanBE(offset);
                                offset++;
                                base.real = packet.readBooleanBE(offset);
                                offset++;
                                base.robotPowerOn = packet.readBooleanBE(offset);
                                offset++;
                                base.emergencyStopped = packet.readBooleanBE(offset);
                                offset++;
                                base.securityStopped = packet.readBooleanBE(offset);
                                offset++;
                                base.programRunning = packet.readBooleanBE(offset);
                                offset++;
                                base.programPaused = packet.readBooleanBE(offset);
                                offset++;

                                base.mode = packet.readByteBE(offset);
                                if (base.mode < 0)
                                    base.mode = 256;
                                offset++;
                                base.speedFraction = packet.readDoubleBE(offset);
                                offset += 8;
                            }
                            break;
                        case 1:
                            {
                                let code = 0;
                                while (true) {
                                    if (code >= 6)
                                        break;
                                    base.sector[code].SetJointPosition(packet.readDoubleBE(offset));
                                    offset += 8;
                                    base.sector[code].JointTarger = packet.readDoubleBE(offset);
                                    offset += 8;
                                    base.sector[code].JointSpeed = packet.readDoubleBE(offset);
                                    offset += 8;
                                    base.sector[code].JointCurrent = packet.readFloatBE(offset);
                                    offset += 4;
                                    base.sector[code].Voltage = packet.readFloatBE(offset);
                                    offset += 4;
                                    base.sector[code].MotorTemperature = packet.readFloatBE(offset);
                                    offset += 4;
                                    base.sector[code].MicroTemperature = packet.readFloatBE(offset);
                                    offset += 4;
                                    base.sector[code].Mode = packet.readByteBE(offset);
                                    if (base.sector[code].Mode < 0)
                                        base.sector[code].Mode = 256;
                                    offset++;
                                    code++;
                                }
                            }
                            break;
                        case 2:
                            {
                                base.analogInputRange[2] = packet.readByteBE(offset);
                                offset++;
                                base.analogInputRange[3] = packet.readByteBE(offset);
                                offset++;
                                base.analogIn[2] = packet.readDoubleBE(offset);
                                offset += 8;
                                base.analogIn[3] = packet.readDoubleBE(offset);
                                offset += 8;
                                base.toolVoltage48V = packet.readFloatBE(offset);
                                offset += 4;
                                base.toolOutputVoltage = packet.readByteBE(offset);
                                offset++;
                                base.toolCurrent = packet.readFloatBE(offset);
                                offset += 4;
                                base.toolTemperature = packet.readFloatBE(offset);
                                offset += 4;
                                base.toolMode = packet.readByteBE(offset);
                                if (base.toolMode < 0)
                                    base.toolMode = 256;
                                offset++;
                            }
                            break;

                        case 3:
                            offset += 40;
                            base.masterTemperature = packet.readFloatBE(offset);
                            offset += 4;
                            base.robotVoltage48V = packet.readFloatBE(offset);
                            offset += 4;
                            base.robotCurrent = packet.readFloatBE(offset);
                            offset += 4;
                            base.masterIOCurrent = packet.readFloatBE(offset);
                            offset += 4;
                            base.masterSafetyState = packet.readByteBE(offset);
                            offset++;
                            base.masterOnOffState = packet.readByteBE(offset);
                            offset++;

                            let signalResponseTimeInMs = packet.readByteBE(offset);
                            offset++;

                            if (signalResponseTimeInMs == 1) {
                                offset += 13;
                            }

                            break;
                        case 4:
                            {
                                base.ToolPosition.X = packet.readDoubleBE(offset);
                                offset += 8;
                                base.ToolPosition.Y = packet.readDoubleBE(offset);
                                offset += 8;
                                base.ToolPosition.Z = packet.readDoubleBE(offset);
                                offset += 8;

                                base.ToolOrientation.X = packet.readDoubleBE(offset);
                                offset += 8;
                                base.ToolOrientation.Y = packet.readDoubleBE(offset);
                                offset += 8;
                                base.ToolOrientation.Z = packet.readDoubleBE(offset);
                                offset += 8;



                                if (base.securityStopped) {
                                    Logger.Warn("!!!SECUTIRY STOPPED!!!");
                                    URCore.IsMove = true;
                                }
                                if (base.emergencyStopped) {
                                    Logger.Error("!!!EMERGENCY STOPPED!!!");
                                    URCore.IsMove = true;
                                }
                            }
                            break;
                        case 7:
                            for (let i = 0; i != 6; i++) {
                                base.sector[i].force_mode_frame = packet.readDoubleBE(offset);
                                offset += 8;
                            }
                            base.Dexterity = packet.readDoubleBE(offset);
                            offset += 8;
                            break;
                        case 8:
                            base.teachButtonPressed = packet.readBooleanBE(offset);
                            offset++;
                            base.teachButtonEnabled = packet.readBooleanBE(offset);
                            offset++;
                            URCore.IsMove = Enumerable.from(base.sector).all(x => x.JointSpeed != 0);
                            break;
                        case 9:
                            offset += packageLength - 5;
                            break;

                    }
                }
                break;
        }
        return base;
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
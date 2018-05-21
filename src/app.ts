import { Socket } from "net";
import { Config } from './config';
import { URCore } from "./Core/URCore";
import { Logger } from "./Tools/Logger";
import "./Tools/BufferExtension";
// -======================================================-

let host: string = Config.UR_IP;
let port: number = Config.UR_Port;

const socket = new Socket();

socket.connect(port, host);
Logger.Log("PlatformR Client has been started.");

socket.on('connect', () => {
    Logger.Log("Connected to URController.");
});
socket.on('data', data => {

    if (!URCore.packet_check(data)) {
        Logger.Warn("Drop packet. [err_size_check]");
        return;
    }
    let arew = URCore.on_packet(data);
});
socket.on('disconnect', () => {
    Logger.Log("Disconnect.");
});



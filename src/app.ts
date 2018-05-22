// Import nodejs modules
import { Socket } from "net";
// Import project modules
import { Config } from './config';
import { URCore } from './Core/URCore';
import { Logger } from './Tools/Logger';
import { app, BrowserWindow } from 'electron';
// Import Extensions
import "./Tools/BufferExtension";
// -======================================================-

let host: string = Config.UR_IP;
let port: number = Config.UR_Port;

const socket = new Socket();

socket.connect(port, host);
Logger.Log(__dirname);

socket.on('connect', () => {
    Logger.Log("Connected to URController.");
});
socket.on("error", (err) => {
    Logger.Error(err);
})
socket.on('data', data => {

    if (!URCore.packet_check(data)) {
        Logger.Warn("Drop packet. [err_size_check]");
        return;
    }
    try {
        var packet_robot = URCore.on_packet(data);
    }
    catch (e) { Logger.Error(e); }
    if (!packet_robot)
        return;
});
socket.on('disconnect', () => {
    Logger.Log("Disconnected.");
});

let win = null;
app.on("ready", () => {
    win = new BrowserWindow({
        width: 800, height: 550,
        icon: `${__dirname}/../wwwroot/favicon.ico`
    });
    win.loadURL(`file://${__dirname}/../wwwroot/index.html`);
    win.setMenu(null);
    win.setResizable(false);
    win.on("closed", () => {
        win = null;
        socket.end();
    });
});
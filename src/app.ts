// Import nodejs modules
import { Socket } from "net";
// Import project modules
import { Config } from './config';
import { URCore } from './Core/URCore';
import { Logger } from './Tools/Logger';
import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
// Import Extensions
import "./Tools/BufferExtension";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";
import * as Enumerable from 'linq';
// -======================================================-

const host: string = Config.UR_IP;
const port: number = Config.UR_Port;

const socket = new Socket();

socket.connect(port, host);
Logger.Log(__dirname);

socket.on('connect', () => {
    Logger.Log("Connected to URController.");
});
socket.on("error", (err) => {
    Logger.Error(err);
    socket.connect(port, host);
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
    if (envs) {
        envs.sender.send('ur5', { opcode: 15, data: packet_robot.getThis() });
    }
});
socket.on('disconnect', () => {
    Logger.Log("Disconnected.");
});

let win: BrowserWindow = null;
app.on("ready", () => {
    win = new BrowserWindow({
        width: 800, height: 550,
        icon: `${__dirname}/../wwwroot/favicon.ico`
    });
    win.loadURL(`file://${__dirname}/../wwwroot/index.html`);
    win.setMenu(null);
    win.setResizable(false);
    win.webContents.openDevTools();
    win.on("closed", () => {
        win = null;
        socket.end();
    });
});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
var envs = undefined;
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg);
    envs = event;
    if (arg.opcode === 14 && arg.data.isComplete) {
        win.loadURL(`file://${__dirname}/../wwwroot/mon.html`);
    }
});


const dict: Array<{ key: string, value: string }> = [];


export class URCommand {
    public static TeachButton(enable: boolean) {
        let socket_cmd = new Socket();
        socket_cmd.on("error", Logger.Error);
        socket_cmd.on('connect', () => {
            Logger.Log("Connected to URCore.");
        });
        socket_cmd.on('disconnect', () => {
            Logger.Log("Disconnected from URCore.");
        });
        socket_cmd.connect(30003, host);
        if (enable) {
            socket_cmd.write(`set robotmode freedrive\n`);
            Logger.Log(`Switch robot mode freedrive`);
        } else {
            socket_cmd.write(`set robotmode run\n`);
            Logger.Log(`Switch robot mode run`);
        }
    }
}

ipcMain.on("ur-delegate", (event: Electron.Event, arg: { opcode: number, action: string }) => {
    switch (arg.action) {
        case "teach":
            {
                let enable: boolean = true;
                Logger.Log(`Action reqest: ${arg.action}`);
                if (!Enumerable.from(dict).any(x => x.key == "teach")) {
                    dict.push({ key: "teach", value: "true" });
                    enable = true;
                } else {
                    enable = false;
                    let val = Enumerable.from(dict).first(x => x.key == "teach").value;

                    if (val === "true") {
                        enable = false;
                        Enumerable.from(dict).first(x => x.key == "teach").value = "false";
                    } else {
                        enable = true;
                        Enumerable.from(dict).first(x => x.key == "teach").value = "true";
                    }
                }
                URCommand.TeachButton(enable);
                event.sender.send("ur-delegate", { opcode: 31, IsEnable: enable });
            }
            break;
    }

});
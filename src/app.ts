// Import nodejs modules
import { Socket } from "net";
import * as fs from 'fs';
// Import project modules
import { Config } from './config';
import { URCore } from './Core/URCore';
import { Logger } from './Tools/Logger';
import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import exists from 'node-file-exists';
// Import Extensions
import "./Tools/BufferExtension";
import * as Enumerable from 'linq';
// -======================================================-



export class App {
    public static IP: string = "";
    public static Port: number = 0;

    public static socket: Socket;
    public static IsEventAssigned: boolean;

    public static IsDebug: boolean;
    public static NeedInstall: boolean;

    public static Connect() {
        App.LinkEvent();
        App.socket.connect(App.Port, App.IP);
    }
    public static Install() {
        if (exists('config.json')) {
            let jconf: Config = JSON.parse(fs.readFileSync('config.json', { encoding: 'utf8' }));
            App.socket = new Socket();
            App.IP = jconf.IP;
            App.Port = jconf.Port;
            App.IsDebug = jconf.Debug;
            App.Connect();
        } else {
            Logger.Warn("Configuration file is not found. Need install App.");
            App.NeedInstall = true;
        }
    }

    public static LinkEvent() {
        if (App.IsEventAssigned) return;
        App.socket.on('connect', App.OnConnect);
        App.socket.on("error", App.OnError);
        App.socket.on('data', App.OnData);
        App.socket.on('disconnect', App.OnDisconnect);
        App.IsEventAssigned = true;
    }



    public static OnConnect() {
        Logger.Log("Connected to URController.");
    }
    public static OnError(err) {
        Logger.Error(err);
        App.Connect();
    }
    public static OnData(data) {
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
        if (ElectronCore.IsInited()) {
            ElectronCore.SendToMainWindows({ opcode: 15, data: packet_robot.getThis() });
        }
    }
    public static OnDisconnect() {
        Logger.Log("Disconnected from URController.");
        App.Connect();
    }
}

export class ElectronCore {
    public static BaseSender: Electron.WebContents;
    public static MainWindow: BrowserWindow;

    public static SendToMainWindows(data) {
        ElectronCore.BaseSender.send('ur5', data);
    }
    public static IsInited(): boolean {
        return !(!ElectronCore.BaseSender);
    }

    public static OnReady() {
        ElectronCore.MainWindow = new BrowserWindow({
            width: 800, height: 550,
            icon: `${__dirname}/../wwwroot/favicon.ico`
        });
        ElectronCore.MainWindow.loadURL(`file://${__dirname}/../wwwroot/index.html`);
        ElectronCore.MainWindow.setMenu(null);
        ElectronCore.MainWindow.setResizable(false);
        //if (App.IsDebug)
        ElectronCore.MainWindow.webContents.openDevTools();
        ElectronCore.MainWindow.on("closed", ElectronCore.OnClose);
        app.on('window-all-closed', ElectronCore.OnAllWindowsClosed);


        ipcMain.on('status', ElectronCore.OnStatus);
        ipcMain.on("ur-delegate", ElectronCore.OnDelegate);
        ipcMain.on("create-config", ElectronCore.OnCreateFile);
    }
    public static OnClose() {
        ElectronCore.MainWindow = null;
        if (App.socket) {
            App.socket.end();
            App.socket = null;
        }
    }
    public static OnAllWindowsClosed() {
        if (process.platform != 'darwin') {
            app.quit();
        }
    }
    public static OnCreateFile(event: Electron.Event, arg: { opcode: number, data: string }) {
        fs.writeFileSync("config.json", JSON.stringify(arg.data), { encoding: "utf-8" });
    }

    public static OnStatus(event: Electron.Event, arg) {
        Logger.Log(arg);
        ElectronCore.BaseSender = event.sender;
        if (arg.opcode === 14 && arg.data.isComplete) {
            if (exists('config.json')) {
                ElectronCore.MainWindow.loadURL(`file://${__dirname}/../wwwroot/mon.html`);
                App.Install();
            }
            else {
                ElectronCore.MainWindow.loadURL(`file://${__dirname}/../wwwroot/config.html`);
            }
        }
    }
    public static OnDelegate(event: Electron.Event, arg: { opcode: number, action: string }) {
        switch (arg.action) {
            case "teach":
                {
                    let enable: boolean = true;
                    Logger.Log(`Action reqest: ${arg.action}`);
                    if (!Enumerable.from(ElectronCore.dict).any(x => x.key == "teach")) {
                        ElectronCore.dict.push({ key: "teach", value: "true" });
                        enable = true;
                    } else {
                        enable = false;
                        let val = Enumerable.from(ElectronCore.dict).first(x => x.key == "teach").value;

                        if (val === "true") {
                            enable = false;
                            Enumerable.from(ElectronCore.dict).first(x => x.key == "teach").value = "false";
                        } else {
                            enable = true;
                            Enumerable.from(ElectronCore.dict).first(x => x.key == "teach").value = "true";
                        }
                    }
                    URCommand.TeachButton(enable);
                    event.sender.send("ur-delegate", { opcode: 31, IsEnable: enable });
                }
                break;
        }
    }



    private static dict: Array<{ key: string, value: string }> = [];
}


app.on("ready", ElectronCore.OnReady);


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
        socket_cmd.connect(30003, App.IP);
        if (enable) {
            socket_cmd.write(`set robotmode freedrive\n`);
            Logger.Log(`Switch robot mode freedrive`);
        } else {
            socket_cmd.write(`set robotmode run\n`);
            Logger.Log(`Switch robot mode run`);
        }
    }
}
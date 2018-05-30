// Import nodejs modules
import { Socket } from "net";
import * as fs from 'fs';
import { EventEmitter } from 'events';
// Import project modules
import { Config } from './config';
import { URCore } from './Core/URCore';
import { Logger } from './Tools/Logger';
import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import exists from 'node-file-exists';
// Import Extensions
import "./Tools/BufferExtension";
import * as Enumerable from 'linq';
import 'linqjs';
import { UR5Info } from './Core/UR5Info';
import { URDriver } from "./External/DriverBridge";
// -======================================================-
export class URProcessor {
    constructor() {
        this.emit = new EventEmitter();
    }
    public emit: EventEmitter;

    public on(name: "packet" | "disconnect", data: (sender: URProcessor, data: UR5Info) => void) {
        this.emit.addListener(name, data);
    }

    public static Emit(sender: URProcessor, data: UR5Info) {
        sender._emit(data);
    }

    private _emit(data: UR5Info) {
        this.emit.emit("packet", this, data);
    }
    public off(name: "packet" | "disconnect", data: (sender: URProcessor, data: UR5Info) => void) {
        this.emit.removeListener(name, data);
    }
}
export class App {
    public static IP: string = "";
    public static Port: number = 0;

    public static socket: Socket;
    public static IsEventAssigned: boolean;

    public static IsDebug: boolean;
    public static NeedInstall: boolean;


    public static IsUseDriver: boolean = true;

    public static Processor: URProcessor;

    public static Connect() {
        if (!App.IsUseDriver) {
            App.LinkEvent();
            App.socket.connect(App.Port, App.IP);
        }
        else {
            URDriver.Init({ IP: App.IP, Port: App.Port }).then((result) => { });
            URDriver.On((d) => {
                App.OnData(d);
            }).then((result) => { });
        }


    }
    public static Install() {
        if (exists('config.json')) {
            let jconf: Config = JSON.parse(fs.readFileSync('config.json', { encoding: 'utf8' }));
            App.socket = new Socket();
            App.IP = jconf.IP;
            App.Port = jconf.Port;
            App.IsDebug = jconf.Debug;
            App.Connect();
            App.Processor = new URProcessor();
            if (App.IsDebug)
                ElectronCore.MainWindow.webContents.openDevTools();
        } else {
            Logger.Warn("Configuration file is not found. Need install App.");
            App.NeedInstall = true;
        }
    }

    public static LinkEvent() {
        if (App.IsEventAssigned) return;
        App.socket.on("error", (err) => {
            Logger.Error(err);
            App.Connect();
        });
        App.socket.on('disconnect', () => {
            Logger.Log("Disconnected from URController.");
            App.Connect();
        });
        App.socket.on('data', App.OnData);
        App.IsEventAssigned = true;
    }
    public static OnData(data) {
        if (!URCore.packet_check(data)) {
            Logger.Warn("Drop packet. [err_size_check]");
            return;
        }
        try {
            var packet_robot = URCore.on_packet(data);
        }
        catch (e) {
            Logger.Error(e);
        }
        if (!packet_robot) return;
        Logger.Log(packet_robot.getPositionString());
        if (ElectronCore.IsInited()) {
            ElectronCore.SendToMainWindows({ opcode: 15, data: packet_robot.getThis() });
        }
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
            case "poweron":
                URCommand.URPowerOn();
                break;
            case "brake-release":
                URCommand.URPowerOn(true);
                break;
            case "start_program":
                URCommand.RunCircle();
                break;
            case "home-pos":
                URCommand.SetHomePosition();
                break;
            case "pidor":
                URCommand.GotPidorPosition();
                break;
            case "nya":
                //URCommand.GotNyanPosition();
                if (URCommand.IsProgStarted) {
                    URCommand.IsProgStarted = false;
                    URDriver.StopProgram('nyan');
                } else {
                    URDriver.RunProgram('nyan');
                    URCommand.IsProgStarted = true;
                }
                break;
        }
    }



    private static dict: Array<{ key: string, value: string }> = [];
}
app.on("ready", ElectronCore.OnReady);

export class URCommand {
    public static IsProgStarted: boolean;
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

    public static URPowerOn(brakeRelease?: boolean) {
        let sock = URCommand.getSocket();

        sock.write("power on\n");
        Logger.Log(`Robot power on.`);
        if (brakeRelease) {
            setTimeout(() => { sock.write("power on\n"); Logger.Log(`Robot brake release.`); }, 2000);
        }
    }

    private static getSocket(port: number = 30003): Socket {
        let socket_cmd = new Socket();
        socket_cmd.connect(30003, App.IP);
        return socket_cmd;
    }


    public static RunCircle() {
        let sock = URCommand.getSocket(29999);
        sock.write('load "R8/circle.urp"\n');
        Logger.Log(`Start program. 'circle.urp'`);
    }

    public static SetHomePosition() {
        let sock = URCommand.getSocket(30001);
        let h = (90.0 / (180.0 / Math.PI)) * -1;
        let coord = `[0,${h},0,${h},0,0]`;
        // ((90 / (180 / Math.PI) * -1)).ToString("0.000000000", new CultureInfo(""));
        sock.write(`movej(${coord},2.200,2.750,0,0)\n`);
        Logger.Log(`Move to home.`);
    }
    public static GotPidorPosition() {
        let sock = URCommand.getSocket(30001);
        let str = "[-1.6374929166313201, -2.3579361402275976, -0.40675549094287033, -0.00700666111506112, 1.4902924278868561, -0.19581227578806448]";
        sock.write(`movej(${str},2.200,2.750,0,0)\n`)
    }

    public static GotNyanPosition() {
        let sock = this.getSocket(30001);
        let str = "[-1.7296626891646794, -0.873911545921711, -2.6683137081091917, 0.8614078700797733, 1.609629230276196, 0.2695362316363145]";
        sock.write(`movej(${str},2.200,2.750,0,0)\n`)
    }
}
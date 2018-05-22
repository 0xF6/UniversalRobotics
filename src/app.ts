// Import nodejs modules
import { Socket } from "net";
// Import project modules
import { Config } from './config';
import { URCore } from "./Core/URCore";
import { Logger } from "./Tools/Logger";
// Import Extensions
import "./Tools/BufferExtension";
// -======================================================-

let host: string = Config.UR_IP;
let port: number = Config.UR_Port;

const socket = new Socket();

socket.connect(port, host);
Logger.Log("Client has been started.");

socket.on('connect', () => {
    Logger.Log("Connected to URController.");
});
socket.on('data', data => {

    if (!URCore.packet_check(data)) {
        Logger.Warn("Drop packet. [err_size_check]");
        return;
    }
    try {
        let arew = URCore.on_packet(data);
        if (!arew)
            return;
    }
    catch (e) {
    }
    //Logger.Log(JSON.stringify(arew));
});
socket.on('disconnect', () => {
    Logger.Log("Disconnected.");
});
/*void set_digital_out(AUX aux, bool value)
                {
                    socket.Send($"set_digital_out({(int)aux},{value})\n");
                    Packet.Dump(socket.Receive());
                    Thread.Sleep(1500);
                }
                void movej(string coord)
                {
                    socket.Send($"movej({coord},1.200,3.750,0,0)\n");
                    Packet.Dump(socket.Receive());
                    Thread.Sleep(3.Second());

                }
                while (true)
                {
                    set_digital_out(AUX.DGhSlf, true);
                    set_digital_out(AUX.DGhGGr, true);
                    movej("[0.000000, -1.570796, -1.570796, 0.000000, 1.570796, -0.000000]");
                    movej("[-0.000000, -0.099626, -1.693985, -1.347982, 1.570796, -0.000000]");
                    movej("[-0.000000, -0.099626, -1.693985, -1.347982, 1.570796, -0.000000]");
                    movej("[-2.686126, -0.794348, -0.709062, -1.638182, 4.256922, -0.000000]");
                    movej("[-4.112961, -0.190877, -1.760175, -1.190541, 5.683758, 0.000000]");
                    set_digital_out(AUX.DGhSlf, false);
                    set_digital_out(AUX.DGhGGr, false);
                    Console.Beep(32767 / 18, 1000);
                }*/

import * as sleep from 'sleep-promise';

class URCommand {
    public static async movej(cmd: string) {
        while (URCore.IsMove) {
            Logger.Warn("wait 0.5 sec");
            await sleep(1000);
            Logger.Warn("wait complete");
        }
        Logger.Log(`Move to ${cmd}`)
        socket.write(`movej(${cmd},1.200,0.750,0)\n`);
        URCore.IsMove = true;
    }
    public static async movep(cmd: string, cmd2: string) {
        while (URCore.IsMove) {
            Logger.Warn("wait 0.5 sec");
            await sleep(1000);
            Logger.Warn("wait complete");
        }
        Logger.Log(`Move to ${cmd}`)
        socket.write(`movec(p${cmd}, p${cmd2},1.200,0.750)\n`);
        URCore.IsMove = true;
    }
}


// set_digital_out(2,True)\n
// set_digital_out(7,True)\n


var qwe = 1;
const asd = async () => {
    socket.write(`set_digital_out(2,True)\n`);
    socket.write(`set_digital_out(7,True)\n`);
    while (qwe) {
        //await URCommand.movej("[0.21457655623442468, -1.310543824602186, 2.246859805006138, -2.486984472470682, 4.725955111206488, 2.8605816465900302]")
        await URCommand.movep("[0.21457655623442468, -1.310543824602186, 2.246859805006138, -2.486984472470682, 4.725955111206488, 2.8605816465900302]",
            "[0.349903018283229, -1.069373052509739, 1.8573945145980497, -2.3404112659484086, 4.728667776466613, 2.9953650722555047]");
        await URCommand.movep("[0.5890787844451654, -1.10015607135572, 1.9118370586988176, -2.3683933884761115, 4.7326877648690475, 3.234008956156418]",
            "[0.5220227317787479, -1.352982847597606, 2.309744874428083, -2.513084496445364, 4.731128844909064, 3.166556261595247]");
    }
    socket.write(`set_digital_out(2,False)\n`);
    socket.write(`set_digital_out(7,False)\n`);
};
/**/

asd();
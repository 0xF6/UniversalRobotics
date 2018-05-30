import * as edge from "electron-edge-js";
import { Logger } from "../Tools/Logger";



export class URDriver {
    public static Init(initData: { IP: string, Port: number }) {
        let res = edge.func({
            assemblyFile: './bin/Native/net45/xur5lib.dll',
            typeName: 'UR5.Core.NodeEntryPoint',
            methodName: 'Init'
        });
        return new Promise<boolean>(function (resolve, reject) {
            res(initData, function (error, result: boolean) {
                if (error) {
                    reject(error);
                    Logger.Warn(error);
                } else {
                    Logger.Log(`Success call API URDriver.Init(); returned: ${result}`);
                    resolve(result);
                }
            });
        });
    }
    public static On(func: (data: any) => void) {
        let res = edge.func({
            assemblyFile: './bin/Native/net45/xur5lib.dll',
            typeName: 'UR5.Core.NodeEntryPoint',
            methodName: 'OnData'
        });
        return new Promise(function (resolve, reject) {
            res({ func }, function (error, result: boolean) {
                if (error) {
                    reject(error);
                    Logger.Warn(error);
                } else {
                    Logger.Log(`Success call API URDriver.On(); returned: ${result}`);
                    resolve(result);
                }
            });
        });
    }
    public static RunProgram(name: string) {
        let res = edge.func({
            assemblyFile: './bin/Native/net45/xur5lib.dll',
            typeName: 'UR5.Core.NodeEntryPoint',
            methodName: 'RunProgram'
        });
        return new Promise(function (resolve, reject) {
            res({ name }, function (error, result: boolean) {
                if (error) {
                    reject(error);
                    Logger.Warn(error);
                } else {
                    Logger.Log(`Success call API URDriver.RunProgram(); returned: ${result}`);
                    resolve(result);
                }
            });
        });
    }
    public static StopProgram(name: string) {
        let res = edge.func({
            assemblyFile: './bin/Native/net45/xur5lib.dll',
            typeName: 'UR5.Core.NodeEntryPoint',
            methodName: 'StopProgram'
        });
        return new Promise(function (resolve, reject) {
            res({ name }, function (error, result: boolean) {
                if (error) {
                    reject(error);
                    Logger.Warn(error);
                } else {
                    Logger.Log(`Success call API URDriver.RunProgram(); returned: ${result}`);
                    resolve(result);
                }
            });
        });
    }
}
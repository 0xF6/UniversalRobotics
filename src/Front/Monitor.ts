/// <reference types="Electron" />
import { IpcRenderer } from 'electron';
import { UR5Info } from '../Core/UR5Info';
import { URMath } from '../Tools/URMath';

declare interface ArgUR5 {
    opcode: number;
    data: UR5Info;
}

export class UR5Render {
    public static On(render: IpcRenderer, math: URMath) {

    }

    public static BindShortcut(): void {
        const { getCurrentWindow, globalShortcut } = require('electron').remote;
        var reload = () => {
            getCurrentWindow().reload()
        }

        globalShortcut.register('F5', reload);
        globalShortcut.register('CommandOrControl+R', reload);
        window.addEventListener('beforeunload', () => {
            globalShortcut.unregister('F5');
            globalShortcut.unregister('CommandOrControl+R');
        })
    }
}
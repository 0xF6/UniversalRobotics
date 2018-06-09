import 'linqable.ts/build/Extensions';
import { app, dialog, ipcMain } from "electron"
import "./Tools/BufferExtension";
import * as log from "electron-log";
import * as isDev from "electron-is-dev";
import { createMainWindow, loadURL } from "./../views/main-window";
import { createUpdater } from "./lib/updater";
import { createMenu } from "./../widget/menu";
// -======================================================-
log.transports.file.level = isDev ? false : "info"
log.transports.console.level = isDev ? "debug" : false


let window: Electron.BrowserWindow;

const appPath = app.getAppPath()


app.on("ready", () => {
window = createMainWindow(appPath)
    createMenu(window);
    if (isDev) {
        window.webContents.on("did-fail-load", () => {
        dialog.showErrorBox(
            "Error opening storybook",
            'Storybook failed to open. Please ensure the storybook server is running by executing "npm run storybook"',
        )
        })
    }
    ipcMain.on("storybook-toggle", () => {
        loadURL(window, appPath);
    })
});
app.on("window-all-closed", app.quit)
createUpdater(app)
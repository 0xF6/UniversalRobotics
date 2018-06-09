const { app, BrowserWindow } = require("electron")
const WindowStateManager = require("electron-window-state-manager")
import { loadURL } from "./load-url";

export const DIMENSIONS = { width: 800, height: 550 }

/**
 * Creates the main window.
 *
 * @param appPath The path to the bundle root.
 * @param showDelay How long in ms before showing the window after the renderer is ready.
 * @return The main BrowserWindow.
 */
export function createMainWindow(appPath: string, showDelay: number = 100) {
    // persistent window state manager
    const windowState = new WindowStateManager("main", {
      defaultWidth: DIMENSIONS.width,
      defaultHeight: DIMENSIONS.height,
    })
  
    // create our main window
    const window = new BrowserWindow({
      width: DIMENSIONS.width,
      height: DIMENSIONS.height,
      x: windowState.x,
      y: windowState.y,
      show: false,
      useContentSize: true,
      titleBarStyle: "hiddenInset",
      autoHideMenuBar: true,
      vibrancy: "light",
      title: app.getName(),
      resizable: false,
      maximizable: false,
      webPreferences: {
        backgroundThrottling: false,
        textAreasAreResizable: false,
      },
    })
    
    // trap movement events
    window.on("close", () => windowState.saveState(window))
    window.on("move", () => windowState.saveState(window))
  
    // load entry html page in the renderer.
    loadURL(window, appPath)
  
    // only appear once we've loaded
    window.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        window.show()
        window.focus()
      }, showDelay)
    })
  
    return window
  }
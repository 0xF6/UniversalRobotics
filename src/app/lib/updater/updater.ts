import { autoUpdater } from "electron-updater"
import * as log from "electron-log"
import * as isDev from "electron-is-dev"


/**
 * Should we peform the auto-update check?
 */
const shouldCheck = !isDev;


/**
 * Setup the auto-update capabilities.
 *
 * @param app The electron app.
 */
export function createUpdater(app: Electron.App): void {
    // jet if we shouldn't be here
    if (!shouldCheck) {
      return
    }
  
    // configure the autoUpdater's logger
    autoUpdater.logger = log
  
    // fires when the app is ready
    app.on("ready", () => {
      autoUpdater.checkForUpdates()
    })
  
    autoUpdater.on("checking-for-update", () => {
      log.info("checking for update")
    })
  
    autoUpdater.on("update-available", (info: string) => {
      log.info("update available")
    })
  
    autoUpdater.on("update-not-available", (info: string) => {
      log.info("update not available")
    })
  
    autoUpdater.on("error", (err: Error) => {
      log.error("error updating", err.message)
    })
  
    autoUpdater.signals.progress(info => {
      log.info(`${info.percent}%`)
    })
  
    // fires when an update has been downloaded
    autoUpdater.signals.updateDownloaded(info => {
      log.info("update downloaded")
      autoUpdater.quitAndInstall()
    })
  }



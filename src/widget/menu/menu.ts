import { Menu } from "electron"
import { createLinuxMenu } from "./linux-menu"
import { createWindowsMenu } from "./windows-menu"
import { isLinux, isWindows } from "../../app/lib/platform"

/**
 * Attaches the menu to the appropriate place.
 *
 * @param window The main window.
 */
export function createMenu(window: Electron.BrowserWindow) {
  if (isLinux()) {
    const template = createLinuxMenu(window)
    const menu = Menu.buildFromTemplate(template)
    window.setMenu(menu)
  } else if (isWindows()) {
    const template = createWindowsMenu(window)
    const menu = Menu.buildFromTemplate(template)
    window.setMenu(menu)
  }
}
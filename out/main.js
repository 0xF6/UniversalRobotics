(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "server";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("app/app.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("linqable.ts/build/Extensions");
const electron_1 = require("electron");
require("./Tools/BufferExtension");
const log = require("electron-log");
const isDev = require("electron-is-dev");
const main_window_1 = require("./../views/main-window");
const updater_1 = require("./lib/updater");
const menu_1 = require("./../widget/menu");
// -======================================================-
log.transports.file.level = isDev ? false : "info";
log.transports.console.level = isDev ? "debug" : false;
let window;
const appPath = electron_1.app.getAppPath();
electron_1.app.on("ready", () => {
    window = main_window_1.createMainWindow(appPath);
    menu_1.createMenu(window);
    if (isDev) {
        window.webContents.on("did-fail-load", () => {
            electron_1.dialog.showErrorBox("Error opening storybook", 'Storybook failed to open. Please ensure the storybook server is running by executing "npm run storybook"');
        });
    }
    electron_1.ipcMain.on("storybook-toggle", () => {
        main_window_1.loadURL(window, appPath);
    });
});
electron_1.app.on("window-all-closed", electron_1.app.quit);
updater_1.createUpdater(electron_1.app);
//# sourceMappingURL=app.js.map
});
___scope___.file("views/main-window/index.js", function(exports, require, module, __filename, __dirname){

"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./main-window"));
__export(require("./load-url"));
//# sourceMappingURL=index.js.map
});
___scope___.file("views/main-window/main-window.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { app, BrowserWindow } = require("electron");
const WindowStateManager = require("electron-window-state-manager");
const load_url_1 = require("./load-url");
exports.DIMENSIONS = { width: 600, height: 500, minWidth: 450, minHeight: 450 };
/**
 * Creates the main window.
 *
 * @param appPath The path to the bundle root.
 * @param showDelay How long in ms before showing the window after the renderer is ready.
 * @return The main BrowserWindow.
 */
function createMainWindow(appPath, showDelay = 100) {
    // persistent window state manager
    const windowState = new WindowStateManager("main", {
        defaultWidth: exports.DIMENSIONS.width,
        defaultHeight: exports.DIMENSIONS.height,
    });
    // create our main window
    const window = new BrowserWindow({
        minWidth: exports.DIMENSIONS.minWidth,
        minHeight: exports.DIMENSIONS.minHeight,
        width: windowState.width,
        height: windowState.height,
        x: windowState.x,
        y: windowState.y,
        show: false,
        useContentSize: true,
        titleBarStyle: "hiddenInset",
        autoHideMenuBar: true,
        // backgroundColor: '#fff',
        vibrancy: "light",
        transparent: true,
        title: app.getName(),
        webPreferences: {
            backgroundThrottling: false,
            textAreasAreResizable: false,
        },
    });
    // maximize if we did before
    if (windowState.maximized) {
        window.maximize();
    }
    // trap movement events
    window.on("close", () => windowState.saveState(window));
    window.on("move", () => windowState.saveState(window));
    window.on("resize", () => windowState.saveState(window));
    // load entry html page in the renderer.
    load_url_1.loadURL(window, appPath);
    // only appear once we've loaded
    window.webContents.on("did-finish-load", () => {
        setTimeout(() => {
            window.show();
            window.focus();
        }, showDelay);
    });
    return window;
}
exports.createMainWindow = createMainWindow;
//# sourceMappingURL=main-window.js.map
});
___scope___.file("views/main-window/load-url.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const url_1 = require("url");
function loadURL(window, appPath) {
    window.loadURL(url_1.format({
        pathname: path_1.join(appPath, "out/index.html"),
        protocol: "file:",
        slashes: true,
    }));
}
exports.loadURL = loadURL;
;
//# sourceMappingURL=load-url.js.map
});
___scope___.file("app/lib/updater/index.js", function(exports, require, module, __filename, __dirname){

"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./updater"));
//# sourceMappingURL=index.js.map
});
___scope___.file("app/lib/updater/updater.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_updater_1 = require("electron-updater");
const log = require("electron-log");
const isDev = require("electron-is-dev");
/**
 * Should we peform the auto-update check?
 */
const shouldCheck = !isDev;
/**
 * Setup the auto-update capabilities.
 *
 * @param app The electron app.
 */
function createUpdater(app) {
    // jet if we shouldn't be here
    if (!shouldCheck) {
        return;
    }
    // configure the autoUpdater's logger
    electron_updater_1.autoUpdater.logger = log;
    // fires when the app is ready
    app.on("ready", () => {
        electron_updater_1.autoUpdater.checkForUpdates();
    });
    electron_updater_1.autoUpdater.on("checking-for-update", () => {
        log.info("checking for update");
    });
    electron_updater_1.autoUpdater.on("update-available", (info) => {
        log.info("update available");
    });
    electron_updater_1.autoUpdater.on("update-not-available", (info) => {
        log.info("update not available");
    });
    electron_updater_1.autoUpdater.on("error", (err) => {
        log.error("error updating", err.message);
    });
    electron_updater_1.autoUpdater.signals.progress(info => {
        log.info(`${info.percent}%`);
    });
    // fires when an update has been downloaded
    electron_updater_1.autoUpdater.signals.updateDownloaded(info => {
        log.info("update downloaded");
        electron_updater_1.autoUpdater.quitAndInstall();
    });
}
exports.createUpdater = createUpdater;
//# sourceMappingURL=updater.js.map
});
___scope___.file("widget/menu/index.js", function(exports, require, module, __filename, __dirname){

"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./menu"));
//# sourceMappingURL=index.js.map
});
___scope___.file("widget/menu/menu.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const linux_menu_1 = require("./linux-menu");
const windows_menu_1 = require("./windows-menu");
const platform_1 = require("../../app/lib/platform");
/**
 * Attaches the menu to the appropriate place.
 *
 * @param window The main window.
 */
function createMenu(window) {
    if (platform_1.isLinux()) {
        const template = linux_menu_1.createLinuxMenu(window);
        const menu = electron_1.Menu.buildFromTemplate(template);
        window.setMenu(menu);
    }
    else if (platform_1.isWindows()) {
        const template = windows_menu_1.createWindowsMenu(window);
        const menu = electron_1.Menu.buildFromTemplate(template);
        window.setMenu(menu);
    }
}
exports.createMenu = createMenu;
//# sourceMappingURL=menu.js.map
});
___scope___.file("widget/menu/linux-menu.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_menu_1 = require("./shared-menu");
const isDev = require("electron-is-dev");
function createLinuxMenu(window) {
    const shared = shared_menu_1.createSharedMenuItems(window);
    const fileMenu = {
        label: "&File",
        submenu: [Object.assign({}, shared.quit, { accelerator: "Alt+F4" })],
    };
    const viewMenu = {
        label: "View",
        submenu: isDev
            ? [
                Object.assign({}, shared.reload, { accelerator: "Ctrl+R" }),
                Object.assign({}, shared.storybook, { accelerator: "Ctrl+Shift+S" }),
                Object.assign({}, shared.toggleDevTools, { accelerator: "Ctrl+Alt+I" }),
            ]
            : [Object.assign({}, shared.fullScreen, { accelerator: "Ctrl+Alt+F" })],
    };
    const helpMenu = {
        label: "Help",
        submenu: [null && shared.visit].filter(Boolean),
    };
    return [fileMenu, viewMenu, helpMenu];
}
exports.createLinuxMenu = createLinuxMenu;
//# sourceMappingURL=linux-menu.js.map
});
___scope___.file("widget/menu/shared-menu.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function createSharedMenuItems(window) {
    const visit = {
        label: "On The Web",
        click() {
            if (null) {
                electron_1.shell.openExternal(null);
            }
        },
    };
    const reload = {
        label: "Reload",
        click() {
            window.webContents.reload();
        },
    };
    const storybook = {
        label: "Toggle Storybook",
        click() {
            electron_1.ipcMain.emit("storybook-toggle");
        },
    };
    const quit = { label: "Quit", role: "quit" };
    const toggleDevTools = {
        label: "Toggle Developer Tools",
        click() {
            window.webContents.toggleDevTools();
        },
    };
    const fullScreen = {
        label: "Toggle Full Screen",
        click() {
            window.setFullScreen(!window.isFullScreen());
        },
    };
    return {
        visit,
        reload,
        storybook,
        quit,
        toggleDevTools,
        fullScreen,
    };
}
exports.createSharedMenuItems = createSharedMenuItems;
//# sourceMappingURL=shared-menu.js.map
});
___scope___.file("widget/menu/windows-menu.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_menu_1 = require("./shared-menu");
const isDev = require("electron-is-dev");
function createWindowsMenu(window) {
    const shared = shared_menu_1.createSharedMenuItems(window);
    const fileMenu = {
        label: "&File",
        submenu: [Object.assign({}, shared.quit, { accelerator: "Alt+F4" })],
    };
    const viewMenu = {
        label: "View",
        submenu: isDev
            ? [
                Object.assign({}, shared.reload, { accelerator: "Ctrl+R" }),
                Object.assign({}, shared.storybook, { accelerator: "Ctrl+Shift+S" }),
                Object.assign({}, shared.toggleDevTools, { accelerator: "Ctrl+Alt+I" }),
            ]
            : [Object.assign({}, shared.fullScreen, { accelerator: "Ctrl+Alt+F" })],
    };
    const helpMenu = {
        label: "Help",
        submenu: [null && shared.visit].filter(Boolean),
    };
    return [fileMenu, viewMenu, helpMenu];
}
exports.createWindowsMenu = createWindowsMenu;
//# sourceMappingURL=windows-menu.js.map
});
___scope___.file("app/lib/platform/index.js", function(exports, require, module, __filename, __dirname){

"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./platform"));
//# sourceMappingURL=index.js.map
});
___scope___.file("app/lib/platform/platform.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLinux(platform = process.platform) {
    return platform === "linux";
}
exports.isLinux = isLinux;
function isWindows(platform = process.platform) {
    return platform === "win32";
}
exports.isWindows = isWindows;
function isMac(platform = process.platform) {
    return platform === "darwin";
}
exports.isMac = isMac;
//# sourceMappingURL=platform.js.map
});
return ___scope___.entry = "app/app.js";
});

FuseBox.import("default/app/app.js");
FuseBox.main("default/app/app.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=x[a];if(!s){if(m&&"electron"!==y.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?g.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);y.dynamic(a,o),r(y.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=_[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){return null!==e&&["function","object","array"].indexOf(typeof e)>-1&&void 0===e.default?Object.isFrozen(e)?e.default=e:Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1}):void 0}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=x[t.pkgName];if(u){var p={};for(var v in u.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var h="function"==typeof r,_=l("async",[e,r]);if(_===!1)return;return s(e,function(e){return h?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return y.sdep&&d(n),n},m||!g.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=g.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,g=m?v||p?{}:window:global;m&&(g.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var h=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:g.$fsbx=g.$fsbx||{};m||(g.require=require);var x=h.p=h.p||{},_=h.e=h.e||{},y=function(){function r(){}return r.global=function(e,r){return void 0===r?g[e]:void(g[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){_[e]=_[e]||[],_[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(g.FuseBox=y),e.FuseBox=y}(this))
//# sourceMappingURL=main.js.map
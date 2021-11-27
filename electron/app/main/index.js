'use strict';
var e = require('electron');
function o(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
var i = o(require('electron-log'));
const n = {
    autoHideMenuBar: !0,
    webPreferences: {
      webSecurity: !1,
      allowRunningInsecureContent: !0,
      nodeIntegration: !0,
      contextIsolation: !1,
      defaultEncoding: 'UTF-8',
    },
    frame: !1,
    fullscreenable: !0,
  },
  t = { label: 'Edit', submenu: [] };
function s() {
  e.app.relaunch(), e.app.quit();
}
new (class {
  createAppMenu() {
    const o = {
        label: 'Application',
        submenu: [
          {
            label: 'Quit',
            accelerator: 'darwin' === process.platform ? 'Command+Q' : 'Alt+Q',
            click: () => {
              e.app.quit();
            },
          },
        ],
      },
      i = [
        {
          label: 'Toggle Full Screen',
          accelerator: 'darwin' === process.platform ? 'Cmd+Ctrl+F' : 'F11',
          click: () => {
            this.window &&
              (this.window.isFullScreen()
                ? (this.window.setFullScreen(!1), this.window.setMenuBarVisibility(!0))
                : (this.window.setFullScreen(!0), this.window.setMenuBarVisibility(!1)));
          },
        },
      ],
      n = e.screen.getAllDisplays();
    n.length > 1 &&
      i.push({
        label: 'Toggle Span',
        click: () => {
          if (this.window) {
            this.window.isFullScreen() && this.window.setFullScreen(!1);
            const e = { x: 0, y: 0, width: 0, height: 0 };
            n.forEach((o) => {
              e.x > o.bounds.x && (e.x = o.bounds.x),
                e.y > o.bounds.y && (e.y = o.bounds.y),
                (e.width = Math.max(e.width, o.bounds.width + o.bounds.x - 1)),
                (e.height = Math.max(e.height, o.bounds.height + o.bounds.y - 1));
            }),
              this.window.isResizable()
                ? (this.window.setMenuBarVisibility(!1),
                  this.window.setMovable(!1),
                  this.window.setResizable(!1),
                  this.window.setBounds(e))
                : (this.window.setMenuBarVisibility(!0),
                  this.window.setMovable(!0),
                  this.window.setResizable(!0),
                  this.window.setSize(Math.round(0.8 * n[0].workArea.width), Math.round(0.8 * n[0].workArea.height)),
                  this.window.center());
          }
        },
      });
    const s = {
      label: 'View',
      submenu: [
        { label: 'Refresh', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Back', accelerator: 'CmdOrCtrl+Backspace', click: () => {} },
        { type: 'separator' },
        ...i,
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'darwin' === process.platform ? 'Cmd+Alt+I' : 'F12',
          role: 'toggleDevTools',
        },
      ],
    };
    e.Menu.setApplicationMenu(e.Menu.buildFromTemplate([o, t, s]));
  }
  createWindow() {
    const o = new e.BrowserWindow({ ...n, width: 1280, height: 800 });
    if (
      ((this.window = o),
      o.on('closed', () => {
        this.window = void 0;
      }),
      o.webContents.on('render-process-gone', (e, n) => {
        i.default.error('window.webContents.renderProcessGone', n), o.reload();
      }),
      o.on('unresponsive', (e) => {
        i.default.error('window.unresponsive', e), o.reload();
      }),
      process.env.DEBUG_URL)
    ) {
      try {
        require('electron-reloader')(module, {});
      } catch (e) {}
      o.webContents.openDevTools(), o.loadURL(process.env.DEBUG_URL).catch(console.log);
    } else o.loadFile('./app/renderer/index.html').catch(console.log);
  }
  run() {
    e.app.requestSingleInstanceLock()
      ? (e.protocol.registerSchemesAsPrivileged([{ scheme: 'file', privileges: { secure: !0, standard: !0 } }]),
        e.app.on('second-instance', () => {
          this.window && (this.window.isMinimized() && this.window.restore(), this.window.focus());
        }),
        e.app.on('window-all-closed', () => {
          'darwin' !== process.platform && e.app.quit();
        }),
        e.app.on('activate', () => {
          void 0 === this.window && this.createWindow();
        }),
        process.on('uncaughtException', (e) => {
          i.default.error('process.uncaughtException', e), s();
        }),
        process.on('unhandledRejection', (e) => {
          i.default.error('process.unhandledRejection', e), s();
        }),
        e.app.on('ready', () => {
          this.createWindow(), this.createAppMenu();
        }))
      : e.app.quit();
  }
})().run();

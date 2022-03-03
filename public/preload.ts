// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");
const appVersion = require("../package.json").version;

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".

process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
  contextBridge.exposeInMainWorld("appVersion", appVersion);
});

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send("ipc-example", "ping");
    },
    on(channel, func) {
      const validChannels = ["ipc-example"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ["ipc-example"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  store: {
    get(val) {
      return ipcRenderer.sendSync("electron-store-get", val);
    },
    set(property, val) {
      ipcRenderer.send("electron-store-set", property, val);
    },
  },

  process: {
    stdin() {
      return process.stdin;
    },
  },

  // Any other methods you want to expose in the window object.
  // ...
});

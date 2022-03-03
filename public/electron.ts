const { app, BrowserWindow, protocol } = require("electron");
const path = require("path");
const url = require("url");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      preload: path.join(__dirname, "preload.ts"),
    },
  });

  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const allowedNavigationDestinations = "https://my-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationURL) => {
    const parsedURL = new URL(navigationURL);
    if (!allowedNavigationDestinations.includes(parsedURL.origin)) {
      event.preventDefault();
    }
  });
});
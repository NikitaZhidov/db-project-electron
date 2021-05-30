const { BrowserWindow } = require("electron/main");
const { MAIN_WINDOW_WIDTH, MAIN_WINDOW_HEIGHT } = require("./variables");

const mainWindow = new BrowserWindow({
  width: MAIN_WINDOW_WIDTH,
  height: MAIN_WINDOW_HEIGHT,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});

mainWindow.loadFile("./views/main.html");

module.exports = mainWindow;

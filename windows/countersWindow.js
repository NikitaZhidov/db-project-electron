const { BrowserWindow } = require("electron/main");
const { MAIN_WINDOW_WIDTH, MAIN_WINDOW_HEIGHT } = require("./variables");

const counterWindow = new BrowserWindow({
  width: MAIN_WINDOW_WIDTH,
  height: MAIN_WINDOW_HEIGHT,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});

counterWindow.loadFile("./views/counters.html");

module.exports = counterWindow;

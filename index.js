const { app, BrowserWindow, ipcMain } = require("electron");
const getDB = require("./db/db");

async function start() {
  const counterWindow = require("./windows/countersWindow");
  counterWindow.hide();

  const mainWindow = require("./windows/mainWindow");
  const addCheckRoutes = require("./ipcRoutes/addCheck.routes");

  const mainRoutes = require("./ipcRoutes/main.routes");
  const countersRoutes = require("./ipcRoutes/counters.routes");
  const addCounterRoutes = require("./ipcRoutes/addCounter.routes");
  const checkCounterRoutes = require("./ipcRoutes/checkCounter.routes");

  const db = await getDB();

  mainRoutes(db);
  countersRoutes(db);
  addCounterRoutes(db);
  checkCounterRoutes(db);
  addCheckRoutes(db);
}

app.on("ready", start);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    start();
  }
});

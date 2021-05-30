const { ipcMain } = require("electron");
const Counter = require("../models/Counter");
const counterWindow = require("../windows/countersWindow");

function counterRoutes(db = null) {
  const counterModel = new Counter(db);

  ipcMain.on("getCounters", async (e, arg) => {
    const counters = await counterModel.getCounters();
    e.sender.send("getCounters", counters);
  });

  ipcMain.on("reloadCounters", (e, arg) => {
    counterWindow.webContents.send("reloadCounters");
  });
}

module.exports = counterRoutes;

const { ipcMain } = require("electron");
const Counter = require("../models/Counter");
const generateControl = require("../reportsGenerate/control");
const generatePenalty = require("../reportsGenerate/penalty");
const generateReceipts = require("../reportsGenerate/receipts");
const counterWindow = require("../windows/countersWindow");
const mainWindow = require("../windows/mainWindow");

function mainRoutes(db = null) {
  const counterModel = new Counter(db);

  ipcMain.on("open-counters", (e, arg) => {
    mainWindow.hide();
    counterWindow.show();
  });

  ipcMain.on("open-main", (e, arg) => {
    counterWindow.hide();
    mainWindow.show();
  });

  ipcMain.on("generate-receipts", async (e, arg) => {
    await generateReceipts();
    e.sender.send("end-generate");
  });

  ipcMain.on("generate-control", async (e, arg) => {
    await generateControl();
    e.sender.send("end-generate");
  });

  ipcMain.on("generate-penalties", async (e, arg) => {
    await generatePenalty(arg);
    e.sender.send("end-generate");
  });

  ipcMain.on("fetchInspectorsMain", async (e, arg) => {
    await generateControl();
    e.sender.send("end-generate");
  });

  ipcMain.on("fetchInspectorsMain", async (e, arg) => {
    const inspectors = await counterModel.getInspectors();
    e.sender.send("fetchInspectorsMain", inspectors);
  });
}

module.exports = mainRoutes;

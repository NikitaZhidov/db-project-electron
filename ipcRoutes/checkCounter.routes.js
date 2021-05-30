const { ipcMain } = require("electron");
const Counter = require("../models/Counter");
const {
  showCheckCounterModal,
  hideCheckCounterModal,
  checkCounterModalWindow,
} = require("../windows/checkCounterModal");

function checkCounterRoutes(db = null) {
  const counterModel = new Counter(db);

  ipcMain.on("open-checkCounterModal", (e, arg) => {
    showCheckCounterModal();
  });

  ipcMain.on("close-checkCounterModal", (e, arg) => {
    hideCheckCounterModal();
  });

  ipcMain.on("checkCounter", async (e, arg) => {
    const counter = await counterModel.getCounter(arg);
    checkCounterModalWindow.webContents.send("checkCounter", counter);
  });

  ipcMain.on("getInspectors", async (e, arg) => {
    const inspectors = await counterModel.getInspectors();
    e.sender.send("getInspectors", inspectors);
  });
}

module.exports = checkCounterRoutes;

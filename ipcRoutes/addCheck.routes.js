const { ipcMain } = require("electron");
const Counter = require("../models/Counter");
const {
  showAddCheckModal,
  hideAddCheckModal,
  addCheckModalWindow,
} = require("../windows/addCheckModal");
const { checkCounterModalWindow } = require("../windows/checkCounterModal");

function addCheckRoutes(db = null) {
  const counterModel = new Counter(db);

  ipcMain.on("open-addCheckModal", (e, arg) => {
    showAddCheckModal();
  });

  ipcMain.on("close-addCheckModal", (e, arg) => {
    hideAddCheckModal();
  });

  ipcMain.on("sendAddCheckInfo", async (e, arg) => {
    let counter = arg;
    const lastMeterValue = await counterModel.getLastCouterValue(
      counter.intMeterId
    );
    counter = { ...counter, ...lastMeterValue };
    addCheckModalWindow.webContents.send("sendAddCheckInfo", counter);
  });

  ipcMain.on("addCheck", async (e, arg) => {
    const checkObj = arg;
    const res = await counterModel.addCheck(checkObj);
    checkCounterModalWindow.webContents.send("reloadChecks");
  });

  ipcMain.on("reloadChecks", async (e, arg) => {
    checkCounterModalWindow.webContents.send("reloadChecks");
  });
}

module.exports = addCheckRoutes;

const { ipcMain } = require("electron");
const Counter = require("../models/Counter");
const {
  showAddCounterModal,
  hideAddCounterModal,
} = require("../windows/addCounterModal");

function addCounterRoutes(db = null) {
  const counterModel = new Counter(db);

  ipcMain.on("open-addCounterModal", (e, arg) => {
    showAddCounterModal();
  });

  ipcMain.on("close-addCounterModal", (e, arg) => {
    hideAddCounterModal();
  });

  ipcMain.on("addCounter", async (e, arg) => {
    const counterObj = arg;
    const resMessage = await counterModel.addCounter(counterObj);
    e.sender.send("addCounter-response", resMessage);
  });
}

module.exports = addCounterRoutes;

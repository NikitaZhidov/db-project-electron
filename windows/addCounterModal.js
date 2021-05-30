const { BrowserWindow } = require("electron");
const counterWindow = require("./countersWindow");
const { MODAL_WINDOW_HEIGHT, MODAL_WINDOW_WIDTH } = require("./variables");

const addCounterModalWindow = new BrowserWindow({
  width: MODAL_WINDOW_WIDTH,
  height: MODAL_WINDOW_HEIGHT,
  show: false,
  parent: counterWindow,
  modal: true,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});

const showAddCounterModal = () => {
  addCounterModalWindow.show();
};
const hideAddCounterModal = () => {
  addCounterModalWindow.hide();
};

addCounterModalWindow.loadFile("./views/addCounterModal.html");

module.exports = {
  addCounterModalWindow,
  showAddCounterModal,
  hideAddCounterModal,
};

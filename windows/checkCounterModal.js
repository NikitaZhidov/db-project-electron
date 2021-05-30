const { BrowserWindow } = require("electron");
const counterWindow = require("./countersWindow");
const { MODAL_WINDOW_HEIGHT, MODAL_WINDOW_WIDTH } = require("./variables");

const checkCounterModalWindow = new BrowserWindow({
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

const showCheckCounterModal = () => {
  checkCounterModalWindow.show();
};
const hideCheckCounterModal = () => {
  checkCounterModalWindow.hide();
};

checkCounterModalWindow.loadFile("./views/checkCounterModal.html");

module.exports = {
  checkCounterModalWindow,
  showCheckCounterModal,
  hideCheckCounterModal,
};

const { BrowserWindow } = require("electron");
const { checkCounterModalWindow } = require("./checkCounterModal");
const { MODAL_WINDOW_HEIGHT, MODAL_WINDOW_WIDTH } = require("./variables");

const addCheckModalWindow = new BrowserWindow({
  width: MODAL_WINDOW_WIDTH,
  height: MODAL_WINDOW_HEIGHT,
  show: false,
  parent: checkCounterModalWindow,
  modal: true,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});

const showAddCheckModal = () => {
  addCheckModalWindow.show();
};
const hideAddCheckModal = () => {
  addCheckModalWindow.hide();
};

addCheckModalWindow.loadFile("./views/addCheckModal.html");

module.exports = {
  addCheckModalWindow,
  showAddCheckModal,
  hideAddCheckModal,
};

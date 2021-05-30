const { ipcRenderer } = require("electron");

const preloaderHTML = `
<div class="preloader">
  <img
    src="../src/assets/gif/preload.gif"
    class="preloader-gif"
    alt="loading"
  />
</div>
`;

let INT_METER_ID = 0;

window.onload = () => {
  const $windowInfo = document.querySelector(".window-info");
  const $closeBtn = document.querySelector(".window__close");
  const $cancelBtn = document.querySelector(".cancel-btn");
  const $addCheckButton = document.querySelector(".add-check-btn");
  const $addCheckForm = document.querySelector(".add-check-form");
  const $selectInspector = document.getElementById("intInspectorId");

  $windowInfo.innerHTML = preloaderHTML;

  $cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  $addCheckButton.addEventListener("click", (e) => {
    e.preventDefault();

    const formData = new FormData($addCheckForm);
    let dataObj = {};
    dataObj.intInspectorId = formData.get("intInspectorId");
    dataObj.datControlDate = formData.get("datControlDate");
    dataObj.txtMeterControlValue = formData.get("txtMeterControlValue");
    dataObj.intMeterId = INT_METER_ID;
    if (!validateCheckCounter(dataObj)) return;
    ipcRenderer.send("addCheck", dataObj);

    closeModal();
  });

  $closeBtn.addEventListener("click", (e) => {
    closeModal();
  });

  ipcRenderer.on("sendAddCheckInfo", (e, args) => {
    let counterInfo = args;
    INT_METER_ID = counterInfo.intMeterId;
    ipcRenderer.send("getInspectors");
    _setCounter(counterInfo);
  });

  ipcRenderer.on("getInspectors", (e, args) => {
    const inspectors = args;
    _setInspectors(inspectors);
  });

  function _setCounter(counter) {
    const html = `
    <div class="window-info__elem">
      <span>Номер счётчика</span>
      <b>${counter.intMeterId}</b>
    </div>
    <div class="window-info__elem">
      <span>Адрес владельца</span>
      <b>${counter.txtMeterAddres.trim()}</b>
    </div>
    <div class="window-info__elem">
      <span>ФИО владельца</span>
      <b>${counter.txtMeterOwner.trim()}</b>
    </div>
    <div class="window-info__elem">
      <span>Последние показания</span>
      <b>${counter.txtCheckMeterValue.trim()}</b>
    </div>
    `;

    $windowInfo.innerHTML = html;
  }

  function _setInspectors(inspectors) {
    $selectInspector.innerHTML = "";
    inspectors.forEach((i) => {
      $selectInspector.insertAdjacentHTML(
        "beforeend",
        `
        <option value=${i.intInspectorId}>${
          i.txtInspectorName.trim() + " " + i.txtInspectorPost.trim()
        }</option>
      `
      );
    });
  }

  function closeModal() {
    $addCheckForm.reset();
    ipcRenderer.send("reloadChecks");
    ipcRenderer.send("close-addCheckModal");
    setTimeout(() => ($windowInfo.innerHTML = preloaderHTML), 200);
  }
};

function validateCheckCounter(dataObj) {
  if (!Date.parse(dataObj.datControlDate)) {
    showError("Введите корректную дату");
    return false;
  }

  if (
    isNaN(+dataObj.txtMeterControlValue) ||
    dataObj.txtMeterControlValue.trim() == ""
  ) {
    showError("Показатель счетчика - это число");
    return false;
  }

  return true;
}

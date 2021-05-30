const { ipcRenderer } = require("electron");

window.addEventListener("load", () => {
  const $addCounterBtn = document.querySelector(".add-counter-btn");
  const $addCounterForm = document.querySelector(".add-counter-form");

  const $closeBtn = document.querySelector(".window__close");
  const $cancelBtn = document.querySelector(".cancel-btn");

  $closeBtn.addEventListener("click", (e) => {
    closeModal();
  });

  $cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  $addCounterBtn.addEventListener("click", (e) => {
    e.preventDefault();

    $addCounterBtn.disabled = true;
    setTimeout(() => {
      $addCounterBtn.disabled = false;
    }, ANIMATION_TIME * 2);

    const formData = new FormData($addCounterForm);
    let dataObj = {};
    dataObj.txtMeterNumber = formData.get("txtMeterNumber");
    dataObj.txtMeterAddres = formData.get("txtMeterAddres");
    dataObj.txtMeterOwner = formData.get("txtMeterOwner");
    dataObj.datMeterBegin = formData.get("datMeterBegin");
    dataObj.txtMeterBeginValue = formData.get("txtMeterBeginValue");
    dataObj.intMeterControlCount = formData.get("intMeterControlCount");
    dataObj.fltMeterSum = formData.get("fltMeterSum");

    if (!validateAddCounterData(dataObj)) return;

    $addCounterBtn.disabled = true;
    ipcRenderer.send("addCounter", dataObj);
  });

  ipcRenderer.on("addCounter-response", (e, args) => {
    setTimeout(() => {
      $addCounterBtn.disabled = false;
    }, ANIMATION_TIME * 2);
    if (args.isError) {
      showError(args.message);
    } else {
      closeModal();
    }
  });

  function closeModal() {
    clearErrors();
    $addCounterForm.reset();
    ipcRenderer.send("reloadCounters");
    ipcRenderer.send("close-addCounterModal");
  }
});

function validateAddCounterData(dataObj) {
  if (isNaN(+dataObj.txtMeterNumber) || dataObj.txtMeterNumber.trim() == "") {
    showError("Номер счётчика - это число");
    return false;
  }

  if (dataObj.txtMeterAddres.trim() == "") {
    showError("Введите адрес");
    return false;
  }

  if (dataObj.txtMeterOwner.trim() == "") {
    showError("Введите ФИО владельца");
    return false;
  }

  if (!Date.parse(dataObj.datMeterBegin)) {
    showError("Введите корректную дату");
    return false;
  }

  if (
    isNaN(+dataObj.txtMeterBeginValue) ||
    dataObj.txtMeterBeginValue.trim() == ""
  ) {
    showError("Начальный показатель счетчика - это число");
    return false;
  }

  if (
    isNaN(+dataObj.intMeterControlCount) ||
    dataObj.intMeterControlCount.trim() == ""
  ) {
    showError("Введите число проверок, если их не было, введите 0");
    return false;
  }

  if (isNaN(+dataObj.fltMeterSum) || dataObj.fltMeterSum.trim() == "") {
    showError("Введите выплаченную сумму.");
    return false;
  }

  return true;
}

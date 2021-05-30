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

let COUNTER_ID = 0;

window.onload = () => {
  const $windowInfo = document.querySelector(".window-info");
  const $wtableBody = document.querySelector(".wtable__body");

  const $addCheckBtn = document.querySelector(".add-check-btn");

  $windowInfo.innerHTML = preloaderHTML;
  $wtableBody.innerHTML = preloaderHTML;

  ipcRenderer.on("checkCounter", (e, args) => {
    const { counter, checks } = args;
    _setChecks(checks);
    _setCounter(counter);

    COUNTER_ID = counter.intMeterId;

    $addCheckBtn.addEventListener("click", (e) => {
      ipcRenderer.send("open-addCheckModal");
      ipcRenderer.send("sendAddCheckInfo", counter);
    });
  });

  ipcRenderer.on("reloadChecks", (e, args) => {
    $windowInfo.innerHTML = preloaderHTML;
    $wtableBody.innerHTML = preloaderHTML;
    ipcRenderer.send("checkCounter", COUNTER_ID);
  });

  let closeBtn = document.querySelector(".window__close");

  closeBtn.addEventListener("click", (e) => {
    closeModal();
  });

  function closeModal() {
    setTimeout(() => {
      $windowInfo.innerHTML = preloaderHTML;
      $wtableBody.innerHTML = preloaderHTML;
    }, 300);
    ipcRenderer.send("close-checkCounterModal");
  }

  function _setChecks(checks) {
    $wtableBody.innerHTML = "";

    checks.forEach((check) => {
      $wtableBody.insertAdjacentHTML(
        "beforeend",
        `
        <div class="wtable__row">
          <div class="wtable__col">${check.txtMeterControlValue.trim()}</div>
          <div class="wtable__col">${new Date(
            check.datControlDate
          ).toLocaleDateString()}</div>
          <div class="wtable__col">${check.txtInspectorName}</div>
          <div class="wtable__col">${check.txtInspectorPost}</div>
        </div>
      `
      );
    });
  }

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
      <span>Дата установки</span>
      <b>${new Date(counter.datMeterBegin).toLocaleDateString()}</b>
    </div>
    <div class="window-info__elem">
      <span>Начальные показания</span>
      <b>${counter.txtMeterBeginValue.trim()}</b>
    </div>
    <div class="window-info__elem">
      <span>Количество проведенных проверок</span>
      <b>${counter.intMeterControlCount}</b>
    </div>
    <div class="window-info__elem">
      <span>Выплаченная сумма за электроэнергию</span>
      <b>${counter.fltMeterSum}</b>
    </div>
    `;

    $windowInfo.innerHTML = html;
  }
};

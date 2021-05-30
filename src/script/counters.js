const { ipcRenderer } = require("electron");

let $tableBody = document.querySelector(".wtable__body");

const preloaderHTML = `
<div class="preloader">
  <img
    src="../src/assets/gif/preload.gif"
    class="preloader-gif"
    alt="loading"
  />
</div>
`;

function _setCounters(counters) {
  $tableBody.innerHTML = "";

  $mainOpenBtn = document.querySelector(".main-open");

  $mainOpenBtn.addEventListener("click", () => {
    ipcRenderer.send("open-main");
  });

  counters.forEach((elem) => {
    $tableBody.insertAdjacentHTML(
      "beforeend",
      `
      <div class="wtable__row data-row" data-id=${elem.intMeterId}>
        <div class="wtable__col">${elem.txtMeterNumber.trim()}</div>
        <div class="wtable__col">${elem.txtMeterAddres.trim()}</div>
        <div class="wtable__col">${elem.txtMeterOwner.trim()}</div>
      </div>
      `
    );
  });

  document.querySelectorAll(".data-row").forEach((elem) => {
    elem.addEventListener("dblclick", (e) => {
      e.preventDefault();
      ipcRenderer.send("open-checkCounterModal");
      ipcRenderer.send("checkCounter", elem.dataset.id);
    });
  });
}

function reloadCounters() {
  $tableBody.innerHTML = preloaderHTML;
  ipcRenderer.send("getCounters");
}

window.addEventListener("load", async () => {
  const addCounterBtn = document.querySelector(".window__button");
  let $reloadBtn = document.querySelector(".counters-reload__btn");

  addCounterBtn.addEventListener("click", () => {
    ipcRenderer.send("open-addCounterModal");
  });

  $reloadBtn.addEventListener("click", () => {
    reloadCounters();
  });

  ipcRenderer.send("getCounters");

  ipcRenderer.on("getCounters", async (e, args) => {
    const counters = args;
    _setCounters(counters);
  });

  ipcRenderer.on("reloadCounters", async (e, args) => {
    reloadCounters();
  });

  reloadCounters();
});

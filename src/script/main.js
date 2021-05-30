const { ipcRenderer } = require("electron");

const loaderHTML = `
<div class="loader-window">
  <img src="../src/assets/gif/preload.gif" alt="loading..." />
</div>
`;

window.onload = () => {
  setIsLoading(true);
  const $openCountersButton = document.querySelector(".counters-open");

  const $selectInspector = document.querySelector("#intInspectorId");

  ipcRenderer.send("fetchInspectorsMain");

  ipcRenderer.on("fetchInspectorsMain", (e, args) => {
    const inspectors = args;
    _setInspectors(inspectors);
    setIsLoading(false);
  });

  ipcRenderer.on("end-generate", () => {
    setIsLoading(false);
  });

  $openCountersButton.addEventListener("click", () => {
    ipcRenderer.send("open-counters");
  });

  $receiptsReportBtn = document.querySelector(".receipts-report-btn");

  $receiptsReportBtn.addEventListener("click", () => {
    setIsLoading(true);
    ipcRenderer.send("generate-receipts");
  });

  $controlReportBtn = document.querySelector(".control-report-btn");

  $controlReportBtn.addEventListener("click", () => {
    setIsLoading(true);
    ipcRenderer.send("generate-control");
  });

  $penaltiesReportBtn = document.querySelector(".penalties-report-btn");

  $penaltiesReportBtn.addEventListener("click", () => {
    setIsLoading(true);
    ipcRenderer.send("generate-penalties", $selectInspector.value);
  });

  function setIsLoading(isLoading) {
    if (isLoading) {
      document.body.insertAdjacentHTML("beforeend", loaderHTML);
    } else {
      let $loader = document.querySelector(".loader-window");
      if ($loader) {
        $loader.remove();
      }
    }
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
};

const fs = require("fs");
const getDB = require("../db/db");
const Counter = require("../models/Counter");

async function generateControl() {
  const db = await getDB();
  const counterModel = new Counter(db);

  const allControls = await counterModel.getControls();
  let inspectors = {};
  allControls.forEach((control) => {
    const inspectorName =
      control.txtInspectorName.trim() + "&" + control.txtInspectorPost.trim();

    if (!inspectors[inspectorName]) inspectors[inspectorName] = {};

    if (!inspectors[inspectorName][control.intMeterId]) {
      inspectors[inspectorName][control.intMeterId] = {
        txtMeterOwner: control.txtMeterOwner.trim(),
        txtMeterNumber: control.txtMeterNumber.trim(),
        txtMeterAddres: control.txtMeterAddres.trim(),
        datMeterBegin: new Date(control.datMeterBegin).toLocaleDateString(),
        controls: [],
      };
    }
    inspectors[inspectorName][control.intMeterId].controls.push({
      datControlDate: new Date(control.datControlDate).toLocaleDateString(),
      txtMeterControlValue: control.txtMeterControlValue.trim(),
    });
  });

  let reportBodyHTML = "";
  let inspectorHTML = "";

  for (let inspector of Object.keys(inspectors)) {
    const inspectorName = inspector.split("&")[0];
    const inspectorPost = inspector.split("&")[1];
    inspectorHTML += `
			<div class="receipt__item">
				<div class="controller-name">
					<span class="h-name">${inspectorName}</span>
					<span class="h-value">${inspectorPost}</span>
				</div>
		`;

    let generalCount = 0;

    for (let owner of Object.keys(inspectors[inspector])) {
      const ownerObj = inspectors[inspector][owner];
      inspectorHTML += `
				<div class="control__item">
			`;
      inspectorHTML += `
				<div class="receipt-header">
					<div class="header__item">
						<span class="h-name">Счётчик</span>:
						<span class="h-value">${ownerObj.txtMeterNumber.trim()}</span>
					</div>
					<div class="header__item">
						<span class="h-name">Дата установки</span>:
						<span class="h-value">${ownerObj.datMeterBegin}</span>
					</div>
					<div class="header__item">
						<span class="h-name">Владелец</span>:
						<span class="h-value">${ownerObj.txtMeterOwner.trim()}</span>
					</div>
					<div class="header__item">
						<span class="h-name">Адрес</span>:
						<span class="h-value">${ownerObj.txtMeterAddres}</span>
					</div>
				</div>
			`;

      inspectorHTML += `
				<div class="receipt-body">
					<h3 class="table-name">Проверки счёта</h3>
						<div class="table col-count-2">
							<div class="t-row t-headers">
								<div class="t-col">Дата</div>
								<div class="t-col">Показания</div>
							</div>
			`;

      let count = 0;
      ownerObj.controls.forEach((control) => {
        count++;
        inspectorHTML += `
        <div class="t-row">
          <div class="t-col">${control.datControlDate}</div>
          <div class="t-col">${control.txtMeterControlValue}</div>
        </div> 
        `;
      });

      generalCount += count;

      inspectorHTML += `
					</div>
				</div>
			`;
      inspectorHTML += `
        <div class="receipt-footer">
          <div class="footer__item">
            <span class="f-name">Число проверок счётчика</span>:
            <span class="f-value">${count}</span>
          </div>
        </div>
      `;
      inspectorHTML += `
				</div>
			`;
    }
    inspectorHTML += `
    <div class="receipt-footer">
      <div class="footer__item">
        <span class="f-name"
          >Общее число проверок выполненных контроллёром</span
        >:
        <span class="f-value">${generalCount}</span>
      </div>
    </div>`;
    inspectorHTML += `</div>`;
  }

  reportBodyHTML = inspectorHTML;

  fs.readFile(__dirname + "/style.css", "utf8", (err, styles) => {
    if (err) console.log(err);
    const reportHTML = `
  	<!DOCTYPE html>
  	<html lang="en">
  		<head>
  			<meta charset="UTF-8" />
  			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
  			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
  			<link rel="preconnect" href="https://fonts.gstatic.com" />
  			<link
  				href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap"
  				rel="stylesheet"
  			/>
  			<title>Проверки</title>
  		</head>
  		<style>
  		${styles}
  		</style>
  		<body>
  			<div class="receipt">
  				${reportBodyHTML}
  			</div>
  		</body>
  	</html>
  	`;

    const now = new Date(Date.now()).toLocaleTimeString().split(":").join(" ");

    fs.writeFile(
      __dirname +
        `/../reports` +
        "/" +
        `controls_${new Date(Date.now())
          .toLocaleDateString()
          .split("/")
          .join(" ")}_${now}.html`,
      reportHTML,
      (err) => {
        if (err) console.log(err);
      }
    );
  });
}

module.exports = generateControl;

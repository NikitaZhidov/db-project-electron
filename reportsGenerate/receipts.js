const fs = require("fs");
const getDB = require("../db/db");
const Counter = require("../models/Counter");

async function generateReceipts() {
  const db = await getDB();
  const counterModel = new Counter(db);

  const allCounters = await counterModel.getCounters();
  let reportBodyHTML = "";
  let a = 0;

  let AllGeneralSum = 0;
  for (let i = 0; i < allCounters.length; i++) {
    let generalSum = 0;
    let beginMeterValue = +allCounters[i].txtMeterBeginValue;
    let lastMeterValue = +allCounters[i].txtMeterBeginValue;

    reportBodyHTML += `<div class="receipt__item">`;
    const receipts = await counterModel.getAllReceipts(
      allCounters[i].intMeterId
    );

    let receiptsHTML = `
			<h3 class="table-name">Оплаченные квитанции</h3>
			<div class="table col-count-3">
				<div class="t-row t-headers">
					<div class="t-col">Показания счётчика</div>
					<div class="t-col">Дата оплаты</div>
					<div class="t-col">Сумма оплаты</div>
				</div>
		`;
    receipts.forEach((r) => {
      generalSum += +r.fitCheckSum;
      AllGeneralSum += +r.fitCheckSum;
      receiptsHTML += `
				<div class="t-row">
					<div class="t-col">${r.txtCheckMeterValue.trim()}</div>
					<div class="t-col">${new Date(r.datCheckPaid).toLocaleDateString()}</div>
					<div class="t-col">${r.fitCheckSum}</div>
				</div>
			`;
      lastMeterValue = +r.txtCheckMeterValue;
    });
    receiptsHTML += `
		</div>
		`;

    let diff = +(lastMeterValue - beginMeterValue);
    reportBodyHTML += `
		<div class="receipt-header">
		<div class="header__item">
			<span class="h-name">Номер счётчика</span>:
			<span class="h-value">${allCounters[i].intMeterId}</span>
		</div>
		<div class="header__item">
			<span class="h-name">Адрес квартиры со счётчиком</span>:
			<span class="h-value">${allCounters[i].txtMeterAddres.trim()}</span>
		</div>
		<div class="header__item">
			<span class="h-name">ФИО владельца</span>:
			<span class="h-value">${allCounters[i].txtMeterOwner.trim()}</span>
		</div>
		<div class="header__item">
			<span class="h-name">Дата установки</span>:
			<span class="h-value">${new Date(
        allCounters[i].datMeterBegin
      ).toLocaleDateString()}</span>
		</div>
		<div class="header__item">
			<span class="h-name">Начальные показания</span>:
			<span class="h-value">${allCounters[i].txtMeterBeginValue}</span>
		</div>
	</div>
	<div class="receipt-body">
		${receiptsHTML}
	</div>
	<div class="receipt-footer">
		<div class="footer__item">
			<span class="f-name">Общая сумма оплаты</span>:
			<span class="f-value">${generalSum}</span>
		</div>
		<div class="footer__item">
			<span class="f-name">Стоимость 1кВт</span>:
			<span class="f-value">${diff && (generalSum / diff).toFixed(2)}</span>
		</div>
		<div class="footer__item">
			<span class="f-name"
				>Разность между последним и первым показаниями счётчика</span
			>:
			<span class="f-value">${diff}</span>
		</div>
	</div>
    `;
    reportBodyHTML += `</div>`;
  }

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
  			<title>Квитанции</title>
  		</head>
  		<style>
  		${styles}
  		</style>
  		<body>
  			<div class="receipt">
  				${reportBodyHTML}
					<div class="receipt-footer">
					<div class="footer__item">
						<span class="f-name">Количество счётчиков</span>:
						<span class="f-value">${allCounters.length}</span>
						<span class="f-name">Общая вырученная сумма</span>:
						<span class="f-value">${AllGeneralSum}</span>
					</div>
				</div>
  			</div>
  		</body>
  	</html>
  	`;

    const now = new Date(Date.now()).toLocaleTimeString().split(":").join(" ");

    fs.writeFile(
      __dirname +
        "/../reports/" +
        `receipts_${new Date(Date.now())
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

module.exports = generateReceipts;

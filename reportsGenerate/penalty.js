const fs = require("fs");
const getDB = require("../db/db");
const Counter = require("../models/Counter");

async function generatePenalty(inspectorId) {
  const db = await getDB();
  const counterModel = new Counter(db);

  const {
    txtInspectorName,
    txtInspectorPost,
  } = await counterModel.getInspector(inspectorId);

  const penaltiesRes = await counterModel.getPenalties(inspectorId);

  let penaltiesOwners = {};

  penaltiesRes.forEach((p) => {
    if (!(p.intMeterId in penaltiesOwners)) {
      penaltiesOwners[p.intMeterId] = {};
      penaltiesOwners[p.intMeterId].txtMeterOwner = p.txtMeterOwner.trim();
      penaltiesOwners[p.intMeterId].txtMeterAddres = p.txtMeterAddres.trim();
      penaltiesOwners[p.intMeterId].txtMeterNumber = p.txtMeterNumber.trim();
      penaltiesOwners[p.intMeterId].penalties = [];
    }
    penaltiesOwners[p.intMeterId].penalties.push({ ...p });
  });

  let reportBodyHTML = `<div class="receipt__item">`;
  reportBodyHTML += `
	<div class="controller-name">
		<span class="h-name">${txtInspectorName}</span>
		<span class="h-value">${txtInspectorPost}</span>
	</div>
	`;

  Object.keys(penaltiesOwners).map((key) => {
    reportBodyHTML += `
		<div class="control__item">
			<div class="receipt-header">
				<div class="header__item">
					<span class="h-name">Счётчик</span>:
					<span class="h-value">${penaltiesOwners[key].txtMeterNumber}</span>
				</div>
				<div class="header__item">
					<span class="h-name">Владелец</span>:
					<span class="h-value">${penaltiesOwners[key].txtMeterOwner}</span>
				</div>
				<div class="header__item">
					<span class="h-name">Адрес</span>:
					<span class="h-value">${penaltiesOwners[key].txtMeterAddres}</span>
				</div>
			</div>
			<div class="receipt-body">
				<h3 class="table-name">Список штрафов</h3>
				<div class="table col-count-3">
					<div class="t-row t-headers">
						<div class="t-col">Дата проверки</div>
						<div class="t-col">Сумма штрафа</div>
						<div class="t-col">Информация об уплате</div>
					</div>`;

    let generalPenaltiesSum = 0;
    let countUnpaid = 0;
    let generalUnpaidSum = 0;

    penaltiesOwners[key].penalties.map((p) => {
      generalPenaltiesSum += +p.fltPenaltySum;
      if (!p.blnPenaltyPaid) {
        countUnpaid++;
        generalUnpaidSum += +p.fltPenaltySum;
      }

      reportBodyHTML += `
				<div class="t-row">
					<div class="t-col">${new Date(p.datControlDate).toLocaleDateString()}</div>
					<div class="t-col">${p.fltPenaltySum}</div>
					<div class="t-col">${p.blnPenaltyPaid ? "Оплачен" : "Неоплачен"}</div>
				</div>
				`;
    });

    reportBodyHTML += `</div>
			</div>
			<div class="receipt-footer">
				<div class="footer__item">
					<span class="f-name">Общая сумма штрафов</span>:
					<span class="f-value">${generalPenaltiesSum}</span>
				</div>
				<div class="footer__item">
					<span class="f-name">Количество неоплаченных штрафов</span>:
					<span class="f-value">${countUnpaid}</span>
				</div>
				<div class="footer__item">
					<span class="f-name">Сумма неоплаченных штрафов</span>:
					<span class="f-value">${generalUnpaidSum}</span>
				</div>
			</div>
		</div>
		`;
  });

  reportBodyHTML += `</div>`;

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
        `penalties_${new Date(Date.now())
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

module.exports = generatePenalty;

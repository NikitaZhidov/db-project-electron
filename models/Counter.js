class Counter {
  constructor(db) {
    this.db = db;
  }

  async getCounters() {
    try {
      const counters = await this.db.request().query(`select * from tblMeter`);
      return counters.recordset;
    } catch (e) {
      console.log(e);
    }
  }

  async addCounter(counter) {
    try {
      let columns = "",
        values = "";
      for (var key of Object.keys(counter)) {
        columns += key.trim() + ", ";
        values += "'" + counter[key].trim() + "'" + ", ";
      }
      columns = columns.slice(0, -2);
      values = values.slice(0, -2);

      await this.db
        .request()
        .query(`INSERT INTO tblMeter (${columns}) VALUES (${values})`);
      return { message: "ok", isError: false };
    } catch (e) {
      return { message: e.message, isError: true };
    }
  }

  async addCheck(check) {
    try {
      await this.db.request().query(
        `INSERT INTO tblControl (intInspectorId, datControlDate, txtMeterControlValue, intMeterId) 
          VALUES ('${check.intInspectorId}', '${check.datControlDate}', '${check.txtMeterControlValue}', '${check.intMeterId}')`
      );

      await this.db
        .request()
        .query(
          `UPDATE tblMeter SET intMeterControlCount = intMeterControlCount + 1 WHERE intMeterId=${check.intMeterId}`
        );
      return { message: "ok", isError: false };
    } catch (e) {
      console.log(e);
    }
  }

  async getCounter(id) {
    try {
      const counter = await this.db
        .request()
        .query(`select * from tblMeter where intMeterId=${id}`);
      const checks = await this.db.request().query(
        `select * from tblControl 
          join tblInspector on tblControl.intInspectorId = tblInspector.intInspectorId 
          where tblControl.intMeterId=${id}`
      );

      return { counter: counter.recordset[0], checks: checks.recordset };
    } catch (e) {
      console.log(e);
    }
  }

  async getInspector(id) {
    try {
      const res = await this.db
        .request()
        .query(`select * from tblInspector where intInspectorId=${id}`);

      return res.recordset[0];
    } catch (e) {
      console.log(e);
    }
  }

  async getInspectors() {
    try {
      const res = await this.db.request().query(`select * from tblInspector`);

      return res.recordset;
    } catch (e) {
      console.log(e);
    }
  }

  async getLastCouterValue(id) {
    try {
      const res = await this.db
        .request()
        .query(
          `select top 1 txtCheckMeterValue from tblCheck where intMeterId=${id} order by datCheckPaid desc`
        );
      return res.recordset[0];
    } catch (e) {
      console.log(e);
    }
  }

  async getAllReceipts(id) {
    try {
      const res = await this.db
        .request()
        .query(`select * from tblCheck where intMeterId=${id}`);
      return res.recordset;
    } catch (e) {
      console.log(e);
    }
  }

  async getControls() {
    try {
      const res = await this.db.request()
        .query(`SELECT tblControl.datControlDate, tblControl.txtMeterControlValue, 
        tblInspector.txtInspectorName, tblInspector.txtInspectorPost,
        tblMeter.txtMeterOwner, tblMeter.txtMeterNumber, tblMeter.txtMeterAddres, tblMeter.datMeterBegin, tblMeter.intMeterId 
        FROM tblControl, tblInspector, tblMeter WHERE tblControl.intInspectorId = tblInspector.intInspectorId 
        AND tblControl.intMeterId = tblMeter.intMeterId`);
      return res.recordset;
    } catch (e) {
      console.log(e);
    }
  }

  async getPenalties(inspectorId) {
    try {
      const res = await this.db.request().query(
        `SELECT tblMeter.intMeterId, tblMeter.txtMeterNumber, tblMeter.txtMeterOwner, tblMeter.txtMeterAddres, 
        tblControl.datControlDate, tblPenalty.fltPenaltySum, tblPenalty.blnPenaltyPaid
        FROM tblInspector, tblMeter, tblControl, tblPenalty
        WHERE tblInspector.intInspectorId = ${inspectorId} AND tblPenalty.intControlId = tblControl.intControlId 
        AND tblControl.intInspectorId = tblInspector.intInspectorId
        AND tblControl.intMeterId = tblMeter.intMeterId ORDER BY tblControl.datControlDate DESC`
      );
      return res.recordset;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Counter;

const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const today = new Date();
const thisYear = today.getFullYear();

export default async function handler(req, res) {
  const {
    query: { name },
  } = req;

  try {
    if (!name) {
      throw new Error();
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(
        /\\n/gm,
        "\n"
      ),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[thisYear];
    const rows = await sheet.getRows();
    await sheet.loadCells("A2:J3600");
    const max_row = sheet.getCellByA1("A3600").value;

    let noEndTimeList = [];
    for (let i = 0; i < max_row; i++) {
      if (
        rows[i].First_name != "" &&
        rows[i].Start != "" &&
        rows[i].End === ""
      ) {
        noEndTimeList.push({
          shift_id: rows[i].shift_id,
          fullName: `${rows[i].First_name} ${rows[i].Last_name}`,
          start: rows[i].Start,
        });
      }
    }

    res.status(201).json({
      message: "A ok!",
      data: noEndTimeList,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

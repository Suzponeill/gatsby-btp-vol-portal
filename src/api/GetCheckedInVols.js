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

    // find the last populated row of data
    let max_row = 0;
    for (let i = 0; i < 350; i++) {
      if (rows[i].shift_id === "-") {
        break;
      } else {
        max_row = rows[i].shift_id;
      }
    }
    max_row -= 1;

    let noEndTimeList = [];
    for (let i = 0; i <= max_row; i++) {
      if (
        rows[i].First_name != "" &&
        rows[i].Start != "" &&
        rows[i].End === ""
      ) {
        noEndTimeList.push({
          shiftId: rows[i].shift_id,
          fullName: `${rows[i].First_name} ${rows[i].Last_name}`,
          start: rows[i].Start,
          checked: false,
        });
      }
    }

    res.status(201).json({
      message: `Checked in Volunteers fetched!`,
      data: noEndTimeList,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const today = new Date();
const thisYear = today.getFullYear();

export default async function handler(req, res) {
  const {
    query: { First_name, Last_name, volType, start, date },
  } = req;

  try {
    if (!First_name) {
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
    await sheet.loadCells("A2:J3600");
    const rows = await sheet.getRows();
    const max_row = sheet.getCellByA1("A3600").value;
    rows[max_row].First_name = First_name;
    rows[max_row].Last_name = Last_name;
    rows[max_row].Type = volType;
    rows[max_row].Date = date;
    rows[max_row].Start = start;
    await rows[max_row].save();
    const shiftId = max_row + 1;

    res.status(201).json({
      message: `${First_name} checked in`,
      shiftId: shiftId,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

// const rows = await sheet.getRows();
// const raw_data = rows[0]._rawData;
// const header_values = rows[0]._sheet.headerValues;
// const row_value = rows[0][id];

// This is where I need to customize the function to find the next empty row and add date, first, last, volType

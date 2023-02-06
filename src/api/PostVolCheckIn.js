const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const today = new Date();
const thisYear = today.getFullYear();

export default async function handler(req, res) {
  const {
    query: { first_name },
  } = req;

  try {
    if (!first_name) {
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
    const max_row = sheet.getCellByA1("A3600").value;
    const last_first = sheet.getCell(max_row, 4).value;

    res.status(201).json({
      message: "A ok!",
      data: `${first_name} checked in`,
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

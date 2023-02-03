const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const Year = new Date().getFullYear;

export default async function handler(req, res) {
  const {
    query: { this_year },
  } = req;

  try {
    if (!this_year) {
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
    const sheet = doc.sheetsByTitle[`${this_year}`];
    const max_row = sheet.getCellByA1("A3600").value;
    await sheet.loadCells(`A2:J${max_row}`);
    // response body needs to be an array of ojects
    {
      date: 1,
      first: 4,
      last: 5,
      start: 6
    }

    res.status(201).json({
      message: "A ok!",
      data: `the last first name is ${last_first}`,
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

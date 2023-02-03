const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

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

    await doc.getInfo();
    const title = doc.title;

    res
      .status(201)
      .json({ message: "A ok!", data: `Your doc title is ${title}` });
  } catch (error) {
    res.status(500).json(error);
  }
}

// const sheet = doc.sheetsByTitle(`${Year}`);
// const rows = await sheet.getRows();
// const raw_data = rows[0]._rawData;
// const header_values = rows[0]._sheet.headerValues;
// const row_value = rows[0][id];

// This is where I need to customize the function to find the next empty row and add date, first, last, volType

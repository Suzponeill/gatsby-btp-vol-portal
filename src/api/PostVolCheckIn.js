const { GoogleSpreadsheet } = require("google-spreadsheet");

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    if (!id) {
      throw new Error();
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(
        /\\n/gm,
        "\n"
      ),
    });

    res.status(200).json({ message: "A ok!" });

    await doc.getInfo();
    const sheet = doc.sheetsById(process.env.GOOGLE_SPREADSHEET_ID);
    const rows = await sheet.getRows();
    const raw_data = rows[0]._sheet.headerValues;
    const row_value = rows[0][id];

    rows[0][id] = Number(row_value) + 1;
    await rows[0].save();
  } catch (error) {
    res.status(500).json(error);
  }
}

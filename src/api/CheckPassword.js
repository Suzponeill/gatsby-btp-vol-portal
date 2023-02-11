const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

export default async function handler(req, res) {
  const {
    query: { passwordInput },
  } = req;

  try {
    if (!passwordInput) {
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
    const sheet = doc.sheetsByTitle["Website_Access"];
    await sheet.loadCells("A2");
    const officialPasswordCell = sheet.getCellByA1("A2");
    const officialPassword = officialPasswordCell.value;

    const validity = officialPassword === passwordInput ? true : false;

    res.status(200).json({
      message: `Password match with GoogleSheet is ${validity}`,
      validity: validity,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

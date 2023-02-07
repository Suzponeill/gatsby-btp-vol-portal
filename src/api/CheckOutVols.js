const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const today = new Date();
const thisYear = today.getFullYear();
const endNow = today.getHours() + ":" + today.getMinutes();

export default async function handler(req, res) {
  const {
    query: { shiftId },
  } = req;

  try {
    if (!shiftId) {
      throw new Error();
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(
        /\\n/gm,
        "\n"
      ),
    });

    const rowIndex = shiftId - 1;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[thisYear];
    await sheet.loadCells("A2:J3600");
    const rows = await sheet.getRows();
    rows[rowIndex].End = endNow;
    await rows[rowIndex].save();

    res.status(200).json({
      message: `${rows[rowIndex].First_name} ${rows[rowIndex].Last_name} checked out at ${rows[rowIndex].End}`,
      endTime: `${endNow}`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

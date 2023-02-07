const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const today = new Date();
const thisYear = today.getFullYear();

export default async function handler(req, res) {
  const {
    query: { shiftId },
  } = req;

  // const end = today.getHours() + ":" + today.getMinutes();

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

    const rowIndex = Number(shiftId);
    rowIndex = rowIndex - 10;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[thisYear];
    await sheet.loadCells("A2:J3600");
    const rows = await sheet.getRows();
    // const troubleshoothing = rows[rowIndex].First_name;
    // rows[key].End = end;
    // await rows[key].save();

    res.status(200).json({
      message: `ok. rowIndex is ${rowIndex}`,
      // endTime: `${rows[key].End}`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

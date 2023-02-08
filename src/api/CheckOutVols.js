const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const today = new Date();
const thisYear = today.getFullYear();
const endNow = today.toLocaleString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
const hours = today.getHours();
const minutes = today.getMinutes();

export default async function handler(req, res) {
  const {
    query: { shiftId, start },
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

    const getEndRnd = () => {
      let m = (parseInt((minutes + 7.5) / 15) * 15) % 60;
      m = m < 10 ? "0" + m : m;
      let h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
      const shiftRnd = h < 12 ? "AM" : "PM";
      h = h < 10 ? "0" + h : h > 12 ? (h -= 12) : h;
      return `${h}:${m} ${shiftRnd}`;
    };

    const rowIndex = shiftId - 1;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[thisYear];
    await sheet.loadCells("A2:J3600");
    const rows = await sheet.getRows();
    const hoursRndFormula = `=(timevalue(N${rowIndex + 2})-timevalue(M${
      rowIndex + 2
    })) * 24`;

    rows[rowIndex].End = endNow;
    rows[rowIndex].Hours_Rnd = hoursRndFormula;
    rows[rowIndex].No_signout = "N";
    rows[rowIndex].End_Rnd = getEndRnd();
    await rows[rowIndex].save();

    res.status(200).json({
      message: `${rows[rowIndex].First_name} ${rows[rowIndex].Last_name} checked out at ${rows[rowIndex].End}`,
      endTime: `${endNow}`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const today = new Date();
const thisYear = today.getFullYear();

export default async function handler(req, res) {
  const {
    query: { shiftId, start, end },
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

    const endhours = Number(end.split(":", 1));
    const endMinutes = Number(end.slice(-5, -3));
    const shift = end.slice(-2);

    const getEndRnd = () => {
      let m = (parseInt((endMinutes + 7.5) / 15) * 15) % 60;
      m = m < 10 ? "0" + m : m;
      let h = endMinutes > 52 ? (endhours === 23 ? 0 : ++endhours) : endhours;
      h = h < 10 ? "0" + h : h > 12 ? (h -= 12) : h;
      return `${h}:${m} ${shift}`;
    };

    const calculateHours_Rnd = () => {
      let startHour = Number(start.split(":", 1));
      start.slice(-2) === "PM" ? (startHour += 12) : startHour;
      const startMins = Number(start.slice(-5, -3));
      const endHr24 = shift === "PM" ? endhours + 12 : endhours;
      const totalMins = (endMinutes - startMins) / 60;
      const totalHours = endHr24 - startHour + totalMins;
      return (Math.round(totalHours * 4) / 4).toFixed(2);
    };

    const rowIndex = shiftId - 1;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[thisYear];
    const rows = await sheet.getRows();
    rows[rowIndex].End = end;
    rows[rowIndex].Hours_Rnd = calculateHours_Rnd();
    rows[rowIndex].No_signout = "N";
    rows[rowIndex].End_Rnd = getEndRnd();
    await rows[rowIndex].save();

    res.status(200).json({
      message: `${rows[rowIndex].First_name} ${rows[rowIndex].Last_name} checked out at ${rows[rowIndex].End}`,
      endTime: `${end}`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

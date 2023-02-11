const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

export default async function handler(req, res) {
  const {
    query: { First_name, Last_name, volType, start, date },
  } = req;

  try {
    if (!First_name || !Last_name) {
      throw new Error();
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(
        /\\n/gm,
        "\n"
      ),
    });

    const today = new Date();
    const thisYear = today.getFullYear();
    const monthName = today.toLocaleString("default", { month: "long" });
    const monthNum =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : today.getMonth() + 1;

    const thisWeekday = today.toLocaleString("default", { weekday: "long" });
    const hours = Number(start.split(":", 1));
    const minutes = Number(start.slice(-5, -3));
    const shift = start.slice(-2, 0);

    const getStartRnd = () => {
      let m = (parseInt((minutes + 7.5) / 15) * 15) % 60;
      m = m < 10 ? "0" + m : m;
      let h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
      h = h < 10 ? "0" + h : h > 12 ? (h -= 12) : h;
      return `${h}:${m} ${shift}`;
    };

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[thisYear];
    const rows = await sheet.getRows();

    let max_row = 0;
    for (let i = 0; i < 3000; i++) {
      if (rows[i].shift_id === "-") {
        break;
      } else {
        max_row = rows[i].shift_id;
      }
    }
    const rowIndex = Number(max_row) + 2;
    const DOYROWFormula = `=if(B${rowIndex}="", "",DAY(B${rowIndex}) + ((Month(B${rowIndex}) -1) * 30) + (MOD(row(),10) / 10))`;

    rows[max_row].shift_id = Number(max_row) + 1;
    rows[max_row].Date = date;
    rows[max_row].Month = monthName;
    rows[max_row].Weekday = thisWeekday;
    rows[max_row].First_name = First_name;
    rows[max_row].Last_name = Last_name;
    rows[max_row].Start = start;
    rows[max_row].Type = volType;
    rows[max_row].No_signout = "Y";
    rows[max_row].Shift = `${thisWeekday}-${shift}`;
    rows[max_row].Start_Rnd = getStartRnd();
    rows[max_row].End_Rnd = "null";
    rows[max_row].Digit_Month = `${monthNum} ${monthName}`;
    rows[max_row].DOY_ROW = DOYROWFormula;
    await rows[max_row].save();

    res.status(201).json({
      message: `${First_name} ${Last_name} is checked in`,
      shiftId: rows[max_row].shift_id,
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

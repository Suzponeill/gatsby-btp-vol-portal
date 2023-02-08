const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

export default async function handler(req, res) {
  const {
    query: { First_name, Last_name, volType, start, date },
  } = req;

  try {
    if (!First_name) {
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
    const thisWeekday = today.toLocaleString("default", { weekday: "long" });
    const shiftTime = start >= "3:30 PM" ? "PM" : "AM";

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[thisYear];
    await sheet.loadCells("A2:J3600");
    const rows = await sheet.getRows();

    let max_row = 0;
    for (let i = 0; i < 350; i++) {
      if (rows[i].shift_id === "-") {
        break;
      } else {
        max_row = rows[i].shift_id;
      }
    }

    rows[max_row].shift_id = Number(max_row) + 1;
    rows[max_row].Date = date;
    rows[max_row].Month = today.toLocaleString("default", { month: "long" });
    rows[max_row].Weekday = thisWeekday;
    rows[max_row].First_name = First_name;
    rows[max_row].Last_name = Last_name;
    rows[max_row].Start = start;
    rows[max_row].Type = volType;
    rows[max_row].No_signout = "Y";
    rows[max_row].Shift = `${thisWeekday}-${shiftTime}`;
    await rows[max_row].save();

    res.status(201).json({
      message: `max_row is ${max_row}`,
      shiftId: max_row + 1,
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

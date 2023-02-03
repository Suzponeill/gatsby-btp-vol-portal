export default async function handler(req, res) {
  const {
    query: { name },
  } = req;

  try {
    if (!name) {
      throw new Error();
    }
    res
      .status(200)
      .json({ message: "A ok!", data: `Hello ${name} from the server` });
  } catch (error) {
    res.status(500).json(error);
  }
}

// export default async function handler(req, res) {
//   const {
//     query: { first },
//   } = req;

//   try {
//     if (!first) {
//       throw new Error();
//     }
//     // await doc.useServiceAccountAuth({
//     //   client_email: process.env.GOOGLE_CLIENT_EMAIL,
//     //   private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(
//     //     /\\n/gm,
//     //     "\n"
//     //   ),
//     // });

//     // await doc.loadInfo();
//     // console.log(doc.title);
//     // const sheet = doc.sheetsByTitle(`${Year}`);
//     // const rows = await sheet.getRows();
//     // const raw_data = rows[0]._rawData;
//     // const header_values = rows[0]._sheet.headerValues;
//     // const row_value = rows[0][id];

//     // // This is where I need to customize the function to find the next empty row and add date, first, last, volType

//     res.status(203).json({ message: "ok!", data: `hello ${first}` });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// }

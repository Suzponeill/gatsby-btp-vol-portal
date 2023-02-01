import * as React from "react";
import "../components/Index.css";
import { useState } from "react";
import CheckedInList from "../components/CheckedInList";
import InputForm from "../components/InputForm";

// const { google } = require("googleapis");
// const sheets = google.sheets("v4");
// const fetch = require("node-fetch");

const IndexPage = () => {
  const [checkedInVols, setCheckedInVols] = useState([]);
  // const [currentVolEntries, setCurrentVolEntries] = useState([]);

  // const d = new Date();
  // let Year = d.getFullYear();

  // async function main() {
  //   console.log("in the api call func");
  //   const authClient = await authorize();
  //   const request = {
  //     spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
  //     range: `'${Year}'!D1:E10`,
  //     valueRenderOption: FORMATTED_VALUE,
  //     auth: authClient,
  //   };

  //   try {
  //     const response = (await sheets.spreadsheets.values.get(request)).data;
  //     console.log(JSON.stringify(response, null, 2));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  // useEffect(main, []);

  const checkInVol = (newVolInfo) => {
    // this will become a post function
    const newVols = [...checkedInVols];
    const newVolJSON = { ...newVolInfo };
    newVols.push(newVolJSON);
    setCheckedInVols(newVols);
  };

  const markVolsChecked = (volFullName) => {
    const newcheckedInVols = checkedInVols.map((volunteer) => {
      if (volunteer.fullName === volFullName) {
        volunteer.checked = !volunteer.checked;
      }
      return volunteer;
    });
    setCheckedInVols(newcheckedInVols);
  };

  const checkOutVols = () => {
    const today = new Date();
    let newCheckedInVols = [];
    for (const volunteer of checkedInVols) {
      if (volunteer.checked === false) {
        newCheckedInVols.push(volunteer);
      } else {
        volunteer.end = today.getHours() + ":" + today.getMinutes();
        // make a patch request to the csv
      }
    }
    setCheckedInVols(newCheckedInVols);
  };

  return (
    <div className="App">
      <header>
        <h1 id="Header-title">BOOKS TO PRISONERS</h1>
        <h2 id="Header-subtitle">VOLUNTEER CHECK IN</h2>
      </header>
      <div className="body">
        <InputForm id="Input" checkInVolCallBackFunc={checkInVol} />
        <div id="CheckedIn-Container">
          <h2 id="list-label">CURRENTLY CHECKED IN</h2>
          <CheckedInList
            markVolsCheckedfunc={markVolsChecked}
            checkedInVols={checkedInVols}
          />
          <button onClick={checkOutVols} id="CheckOut">
            CHECK OUT
          </button>
        </div>
      </div>
      <footer>
        <h3>
          For technical help contact{" "}
          <a href="mailto:suzponeill@gmail.com">Suzanne O'Neill</a>
        </h3>
      </footer>
    </div>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;

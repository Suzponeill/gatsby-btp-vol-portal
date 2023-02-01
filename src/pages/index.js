import * as React from "react";
import "../components/Index.css";
import { useState, useEffect } from "react";
import CheckedInList from "../components/CheckedInList";
import InputForm from "../components/InputForm";
const { GoogleSpreadsheet } = require("google-spreadsheet");

const IndexPage = async () => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    api_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  console.log(doc.title);

  const [checkedInVols, setCheckedInVols] = useState([]);
  // const [uniqVols, setUniqVols] = useState([]);
  // const [response, setResponse] = useState(null);

  // useEffect(async () => {
  //   const result = await fetch(`${doc}`).then((res) => res.json());

  //   setUniqVols(result.data);
  //   console.log(uniqVols);
  // });

  const checkInVol = async (newVolInfo) => {
    //   try {
    //     const response = await fetch("/api/some-endpoint?name=Paul");
    //     if (!response.ok) {
    //       throw new Error(response.statusText);
    //     }
    //     const data = await response.json();
    //     setResponse(data);
    //   } catch (error) {
    //     setResponse(error.message);
    //   }

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

export const Head = () => <title>BTP Volunteer Check-in</title>;
export default IndexPage;

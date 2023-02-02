import * as React from "react";
import "../components/Index.css";
import { useState } from "react";
import CheckedInList from "../components/CheckedInList";
import InputForm from "../components/InputForm";

const IndexPage = () => {
  const [checkedInVols, setCheckedInVols] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(false);

  const checkInVol = async (newVolInfo) => {
    // update the UI
    const newVols = [...checkedInVols];
    const newVolJSON = { ...newVolInfo };
    newVols.push(newVolJSON);
    setCheckedInVols(newVols);

    // post to the Google Sheet
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/PostVolCheckIn?volObj=${newVolInfo}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const result = await response.json();
      setResults(result);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setError({ error: true, message: error.message });
    }
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

import React, { useState, useEffect } from "react";
import "../components/Index.css";
import CheckedInList from "../components/CheckedInList";
import InputForm from "../components/InputForm";

const IndexPage = () => {
  const [checkedInVols, setCheckedInVols] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isError, setIsError] = useState(false);

  // Make API call to see if there are any volunteers currently checked in
  useEffect(() => {
    async function getCheckedInVols() {
      try {
        const response = await fetch(`/api/GetCheckedInVols?name=Suzanne`);

        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        console.log(data.message);
        setCheckedInVols(data.data);
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        setIsError({ error: true, message: error.message });
        console.log(error.message);
      }
    }
    getCheckedInVols();
  }, []);

  // Make API call to Check in Volunteers
  const checkInVol = async (newVolInfo) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/PostVolCheckIn?First_name=${newVolInfo.first}&Last_name=${newVolInfo.last}&date=${newVolInfo.date}&volType=${newVolInfo.volType}&start=${newVolInfo.start}`
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const result = await response.json();
      console.log(`line 31: ${result.shiftId}`);
      setIsSubmitting(false);
      // update the UI
      const newVols = [...checkedInVols];
      const newVolJSON = { ...newVolInfo };
      // newVolJSON[shiftId] = result.shiftId;
      newVols.push(newVolJSON);
      setCheckedInVols(newVols);
    } catch (error) {
      setIsSubmitting(false);
      setIsError({ error: true, message: error.message });
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
        <InputForm
          isSubmitting={isSubmitting}
          isError={isError.error}
          id="Input"
          checkInVolCallBackFunc={checkInVol}
        />
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

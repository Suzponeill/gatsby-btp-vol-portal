import React, { useState, useEffect } from "react";
import "../components/Index.css";
import CheckedInList from "../components/CheckedInList";
import InputForm from "../components/InputForm";

const IndexPage = () => {
  const [checkedInVols, setCheckedInVols] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isError, setIsError] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState("");

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
        setCheckedInCount(data.data.length);
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
      console.log(result.message);
      setIsSubmitting(false);
      // update the UI
      const newVols = [...checkedInVols];
      const newVolJSON = { ...newVolInfo };
      newVolJSON["shiftId"] = await result.shiftId;
      newVols.push(newVolJSON);
      setCheckedInVols(newVols);
      setCheckedInCount(newVols.length);
    } catch (error) {
      setIsSubmitting(false);
      setIsError({ error: true, message: error.message });
    }
  };

  // UI & state update of check out check box toggle passed as prop to CheckedInList
  const markVolsChecked = async (volShiftId) => {
    const newcheckedInVols = checkedInVols.map((volunteer) => {
      if (volunteer.shiftId === volShiftId) {
        volunteer.checked = !volunteer.checked;
      }
      return volunteer;
    });
    setCheckedInVols(newcheckedInVols);
    setCheckedInCount(newcheckedInVols.length);
  };

  // Check Volunteers Out
  const checkOutVols = async () => {
    let newCheckedInVols = [];
    for (const volunteer of checkedInVols) {
      if (volunteer.checked === false) {
        newCheckedInVols.push(volunteer);
      } else {
        try {
          const response = await fetch(
            `/api/CheckOutVols?shiftId=${volunteer.shiftId}&start=${volunteer.start}`
          );
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const result = await response.json();
          console.log(result.message);
        } catch (error) {
          console.log(error);
        }
      }
    }
    setCheckedInVols(newCheckedInVols);
    setCheckedInCount(newCheckedInVols.length);
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
          <h2 id="list-label">
            {checkedInCount === 1
              ? checkedInCount + " VOLUNTEER "
              : checkedInCount === 0
              ? "NO VOLUNTEERS "
              : checkedInCount > 1
              ? checkedInCount + " VOLUNTEERS "
              : ""}
            CURRENTLY CHECKED IN
          </h2>
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

export const Head = () => <title>Volunteer Check In</title>;

import * as React from "react";
import { useState } from "react";
import "./InputForm.css";
import PropTypes from "prop-types";

const IntialVolForm = {
  first: "",
  last: "",
};

const InputForm = (props) => {
  const [formData, setFormData] = useState(IntialVolForm);
  const [typeSelected, setTypeSelected] = useState("None");
  const [lengthError, setLengthError] = useState("");

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);
  };

  const handleSelect = (e) => {
    setTypeSelected(e.target.value);
  };

  const handleVolCheckIn = async (e) => {
    e.preventDefault();
    if (formData.first.length === 0) {
      setLengthError("Please enter a first name to check in.");
      console.log(lengthError);
    } else if (formData.last.length === 0) {
      setLengthError("Please enter a last name to check in.");
      console.log(lengthError);
    } else {
      setLengthError("");
      const today = new Date();
      let submitVal = { ...formData };
      submitVal["fullName"] = formData.first + " " + formData.last;
      submitVal["date"] =
        parseInt(today.getMonth() + 1) +
        "/" +
        today.getDate() +
        "/" +
        today.getFullYear();
      submitVal["start"] = today.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      submitVal["end"] = null;
      submitVal["checked"] = false;
      if (typeSelected === undefined) {
        submitVal["volType"] = "None";
      } else {
        submitVal["volType"] = typeSelected;
      }
      props.checkInVolCallBackFunc(submitVal);
      setFormData(IntialVolForm);
      setTypeSelected("None");
    }
  };

  const isDisabled = props.isSubmitting ? "disabled" : "enabled";

  return (
    <>
      <h2 id="Input-label">ENTER VOLUNTEER NAME</h2>
      <form id="Input" onSubmit={handleVolCheckIn}>
        <div className="namesInput">
          <label htmlFor="first">First Name</label>
          <input
            type="text"
            id="first"
            name="first"
            value={formData.first}
            onChange={handleChange}
            autocomplete="off"
          />

          <label htmlFor="last">Last Name</label>
          <input
            type="text"
            id="last"
            name="last"
            value={formData.last}
            onChange={handleChange}
            autocomplete="off"
          />
          {lengthError && <h4 id="lengthError">{lengthError}</h4>}
        </div>

        <label htmlFor="volType">Volunteer Type</label>
        <select
          value={typeSelected}
          id="Voltype"
          name="Voltype"
          onChange={handleSelect}
        >
          <option value="None">None</option>
          <option value="Court">Court</option>
          <option value="Keyholder">Keyholder</option>
          <option value="School">School</option>
          <option value="Group">Group</option>
          <option value="Intern">Intern</option>
        </select>

        <button
          disabled={props.isSubmitting || props.isError}
          id="Check-in-button"
          type="submit"
          value="Check In Volunteer"
          className={isDisabled}
        >
          CHECK IN
        </button>
      </form>
    </>
  );
};

InputForm.propTypes = {
  checkInVolCallBackFunc: PropTypes.func.isRequired,
};

export default InputForm;

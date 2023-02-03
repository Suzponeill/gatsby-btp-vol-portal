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

  const handleVolCheckIn = (e) => {
    e.preventDefault();
    const today = new Date();
    let submitVal = { ...formData };
    submitVal["fullName"] = formData.first + " " + formData.last;
    submitVal["date"] =
      parseInt(today.getMonth() + 1) +
      "/" +
      today.getDate() +
      "/" +
      today.getFullYear();
    submitVal["start"] = today.getHours() + ":" + today.getMinutes();
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
  };

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
          />

          <label htmlFor="last">Last Name</label>
          <input
            type="text"
            id="last"
            name="last"
            value={formData.last}
            onChange={handleChange}
          />
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

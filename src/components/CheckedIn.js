import * as React from "react";
import PropTypes from "prop-types";

const CheckedIn = (props) => {
  const volFullName = props.fullName;
  const volStart = props.start;
  const volChecked = props.checked;
  const shiftId = props.shiftId;
  const markVolsCheckedfunc = props.markVolsCheckedfunc;

  const handleChange = () => {
    markVolsCheckedfunc(shiftId);
  };

  return (
    <tr>
      <td>{volFullName}</td>
      <td>{volStart}</td>
      <td>
        <div className="checkBoxContainer">
          <input
            id="checkbox"
            type="checkbox"
            checked={volChecked}
            onChange={handleChange}
          />
        </div>
      </td>
    </tr>
  );
};

CheckedIn.propTypes = {
  fullName: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
};

export default CheckedIn;

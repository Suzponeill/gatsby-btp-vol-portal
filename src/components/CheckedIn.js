import * as React from "react";
import PropTypes from "prop-types";

const CheckedIn = (props) => {
  const volFullName = props.fullName;
  const volStart = props.start;
  const volChecked = props.checked;
  const markVolsCheckedfunc = props.markVolsCheckedfunc;

  // const [checkedState, setCheckedState] = useState(volChecked);

  const handleChange = () => {
    markVolsCheckedfunc(volFullName);
    // setCheckedState(volChecked);
    console.log(volChecked);
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
  date: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
};

export default CheckedIn;

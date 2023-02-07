import * as React from "react";
import CheckedIn from "./CheckedIn";

const CheckedInList = (props) => {
  const volunteerComponents = [];

  for (const volunteer of props.checkedInVols) {
    volunteerComponents.push(
      <CheckedIn
        key={volunteer.shiftId}
        shiftId={volunteer.shiftId}
        first={volunteer.first}
        last={volunteer.last}
        fullName={volunteer.fullName}
        date={volunteer.date}
        Voltype={volunteer.Voltype}
        start={volunteer.start}
        end={volunteer.end}
        checked={volunteer.checked}
        markVolsCheckedfunc={props.markVolsCheckedfunc}
      />
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Volunteer Name</th>
          <th>Check in Time</th>
          <th>Check Out</th>
        </tr>
      </thead>
      <tbody>{volunteerComponents}</tbody>
    </table>
  );
};

export default CheckedInList;

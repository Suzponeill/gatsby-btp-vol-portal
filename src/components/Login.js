import * as React from "react";
import { useState } from "react";

const LoginForm = (props) => {
  const [formPWD, setFormPWD] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const newPWD = e.target.value;
    setFormPWD(newPWD);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const status = await props.loginCallBackFunc(formPWD);
    setIsError(status);
    setFormPWD("");
  };

  return (
    <>
      <h2 id="Input-label">Please Log In</h2>
      <form id="Input" onSubmit={handleLogin}>
        <div className="passwordInput">
          <label htmlFor="first">Enter Password</label>
          <input
            type="text"
            id="password"
            name="password"
            value={formPWD}
            onChange={handleChange}
            autocomplete="off"
          />
        </div>

        <button
          id="Login-Button"
          className="enabled"
          type="submit"
          value="Login"
        >
          SUBMIT
        </button>
      </form>
      <>
        {isError && (
          <>
            <h3 id="failed_notice">That password is incorrect. </h3>
            <p id="failed_p">
              The password for this interface is located on the Website_Access
              tab of the Volunteer Hours Google Sheet. <br />
              If you do not have access to the Google Sheet, then you do not
              have access to this portal.
            </p>
          </>
        )}
      </>
    </>
  );
};

export default LoginForm;

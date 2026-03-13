import Switcher from "./LoginPanelSwitcher.jsx";
import { useState } from "react";

export default function RegisterForm({ onSwitch }) {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [UsernameTaken, setUsernameTaken] = useState("");

  function RegisterUser(e) {
    e.preventDefault();

    fetch("http://localhost:3000/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Username, Password }),
    })
      .then((Response) => {
        if (!Response.ok) {
          console.log("Error: " + Response.status);
        }
        return Response.text();
      })
      .then((data) => {
        setUsernameTaken(data);
      })
      .catch((error) => {
        console.error("Error sending data to API:", error);
      });
  }

  return (
    <>
      <div id="RegisterInner">
        <h1>Register</h1>
        <form onSubmit={RegisterUser}>
          <input
            type="text"
            placeholder="Username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br></br>
          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Switcher message={"Log In"} onSwitch={onSwitch} />
          <br />
          <button type="submit" className="primaryButton">
            Register
          </button>
          <br />
          <span>{UsernameTaken}</span>
        </form>
      </div>
    </>
  );
}

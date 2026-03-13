import Switcher from "./LoginPanelSwitcher.jsx";
import { useState } from "react";

export default function LoginForm({ onSwitch }) {
  const [Message, setMessage] = useState("");
  const [LoginUsername, setLoginUsername] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");

  function LoginUser(e) {
    e.preventDefault();

    fetch(
      "http://localhost:3000/db?" +
        new URLSearchParams({
          username: LoginUsername.toString(),
          password: LoginPassword.toString(),
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then((Response) => {
        if (!Response.ok) {
          console.log("Error:" + Response.status);
        }
        return Response.text();
      })
      .then((data) => {
        setMessage(data);
      })
      .catch((error) => {
        console.error("Something went wrong: ", error);
      });
  }

  return (
    <>
      <div id="LoginInner">
        <h1>Login</h1>
        <form onSubmit={LoginUser}>
          <input
            type="text"
            placeholder="Username"
            value={LoginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={LoginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <br />
          <Switcher message={"Sign Up"} onSwitch={onSwitch} />
          <br />
          <button type="submit" className="primaryButton">
            Login
          </button>
          <br />
          <span>{Message}</span>
        </form>
      </div>
    </>
  );
}

import Switcher from "./LoginPanelSwitcher.jsx";
import { useState } from "react";

export default function RegisterForm({ onSwitch }) {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [UsernameTaken, setUsernameTaken] = useState("");

  async function RegisterUser(e) {
    e.preventDefault();
    try {
      //request signup from server
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: Username,
          password: Password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      const { message } = await response.json();
      setUsernameTaken(message);
    } catch (error) {
      console.error("Login Error:", error);
      setUsernameTaken("Invalid username or password.");
    }
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
          <span id="message">{UsernameTaken}</span>
        </form>
      </div>
    </>
  );
}

import Switcher from "./LoginPanelSwitcher.jsx";
import { useState } from "react";

export default function LoginForm({ onSwitch }) {
  const [Message, setMessage] = useState("");
  const [LoginUsername, setLoginUsername] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");

  async function LoginUser(e) {
    e.preventDefault();
    try {
      //request login from server
      const response = await fetch("http://localhost:3000/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: LoginUsername,
          password: LoginPassword,
        }),
      });

      //if server response not ok throw error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      //if server responds do this V
      const { username, message } = await response.json();

      if (message === "Invalid Username or Password") {
        throw new Error("Invalid credentials");
      }

      setMessage(message);
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Invalid username or password.");
    }
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
            required
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={LoginPassword}
            required
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <br />
          <Switcher message={"Sign Up"} onSwitch={onSwitch} />
          <br />
          <button type="submit" className="primaryButton">
            Login
          </button>
          <br />
          <span id="message">{Message}</span>
        </form>
      </div>
    </>
  );
}

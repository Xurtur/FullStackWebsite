import Switcher from "./LoginPanelSwitcher.jsx";
import { useState } from "react";

export default function LoginForm({ onSwitch }) {
  const [Message, setMessage] = useState("");
  const [LoginUsername, setLoginUsername] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");

  async function LoginUser(e) {
    e.preventDefault();
    try {
      const url = new URL("http://localhost:3000/login");
      url.search = new URLSearchParams({
        username: LoginUsername.toString(),
        password: LoginPassword.toString(),
      });

      const Response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!Response.ok) {
        throw new Error("Login Failed");
      }
      const { token, username, mes } = await Response.json();
      localStorage.setItem("authtoken", token);
      localStorage.setItem("username", username);
      setMessage(mes);
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

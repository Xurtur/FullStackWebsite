import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegisterForm from "./Login/RegisterPanel.jsx";
import LoginForm from "./Login/LoginPanel.jsx";
import Popup from "./Login/Popup.jsx";
import Home from "./Home/Home.jsx";
import ItemUpload from "./ItemAdder/ItemUpload.jsx";
import "./index.css";

function App() {
  const [onSwitch, setonSwitch] = useState(true);
  const [OpenPop, setOpenPop] = useState(false);

  function close() {
    setOpenPop(!OpenPop);
  }
  return (
    <BrowserRouter>
      <Popup open={OpenPop} close={close}>
        <div>
          {onSwitch ? (
            <LoginForm onSwitch={() => setonSwitch(false)} close={close} />
          ) : (
            <RegisterForm onSwitch={() => setonSwitch(true)} />
          )}
        </div>
      </Popup>

      <nav>
        <div id="bar">
          <Link id="NavButtons" to="/">
            Home
          </Link>
          <Link id="NavButtons" to="/AddItem">
            Shop
          </Link>
          <button id="LoginButton" onClick={close}>
            Login
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/AddItem" element={<ItemUpload />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
createRoot(document.getElementById("root")).render(<App />);

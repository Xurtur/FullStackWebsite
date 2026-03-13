import { useState } from "react";

export default function Switcher({ message, onSwitch }) {
  return (
    <>
      <span id="PanelSwitch" onClick={onSwitch}>
        {message}
      </span>
    </>
  );
}

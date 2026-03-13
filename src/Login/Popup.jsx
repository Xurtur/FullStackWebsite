import "./Popup.css";

export default function Popup({ open, close, children }) {
  if (!open) {
    return null;
  }
  return (
    <div id="CenterDiv">
      <div id="InnerPopup">
        <span id="CloseButton" onClick={close}>
          X
        </span>
        {children}
      </div>
    </div>
  );
}

import "./Popup.css";

export default function Popup({ open, close, children }) {
  if (!open) {
    return null;
  }
  function handleOverlayClick(e) {
    // Only close if clicked on the overlay (not the inner popup)
    if (e.target === e.currentTarget) {
      close();
    }
  }
  return (
    <div id="CenterDiv" onClick={handleOverlayClick}>
      <div id="InnerPopup">
        <span id="CloseButton" onClick={close}>
          X
        </span>
        {children}
      </div>
    </div>
  );
}

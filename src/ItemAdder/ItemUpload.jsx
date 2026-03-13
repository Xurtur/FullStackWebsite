import { useEffect, useRef, useState } from "react";
import "./ItemAdder.css";

export default function ItemUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInterval = useRef(null);

  //everytime file changes give a temp url for viewing
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  //get added pictures and store it for use
  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  }

  //clear uploaded images, disable when uploading is in progress
  function handleRemove(event) {
    event.preventDefault();
    if (isUploading) return;

    if (uploadInterval.current) {
      clearInterval(uploadInterval.current);
      uploadInterval.current = null;
    }

    setFile(null);
    setUploadProgress(0);
  }

  //Add loading bar (simulated only)
  //Change to connect to server later on
  function handleSubmit(event) {
    event.preventDefault();
    if (!file || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    uploadInterval.current = setInterval(() => {
      setUploadProgress((current) => {
        const next = current + 10;
        if (next >= 100) {
          clearInterval(uploadInterval.current);
          uploadInterval.current = null;

          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            setFile(null);
          }, 200);
          return 100;
        }
        return next;
      });
    }, 120);
  }

  return (
    <div id="OuterDiv">
      <div id="InnerDiv">
        <form id="AddProduct" onSubmit={handleSubmit}>
          <span>Product Name</span>
          <br />
          <input placeholder="Name" />
          <br />
          <span>Price</span>
          <br />
          <input placeholder="Price" />
          <br />
          <span>Product Description</span>
          <br />
          <textarea placeholder="Product Description" />
          <br />

          <label className="fileInputLabel">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <span className="fileInputText">Choose an image</span>
          </label>

          {/* if previewurl is not null show preview of image */}
          {previewUrl && (
            <div className="imagePreview">
              <button
                className="removePreviewButton"
                onClick={handleRemove}
                type="button"
                aria-label="Remove selected image"
                disabled={isUploading}
              >
                ×
              </button>
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
          {/* if uploading show progress bar, set progress as progress widt */}
          {isUploading && (
            <div className="uploadProgress">
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span>{uploadProgress}%</span>
            </div>
          )}
          <br />
          {/* disable button when uploading */}
          <button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading…" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import "./ItemAdder.css";
import Popup from "../Login/Popup";

export default function ItemUpload() {
  const [openPop, setopenPop] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);

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

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  //get added pictures and store it for use
  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  }

  //clear uploaded images, disable when uploading is in progress
  function handleRemove(event) {
    event.preventDefault();
    if (isUploading) return;
    setFile(null);
  }

  //Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    if (!file || isUploading) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append(
      "productName",
      document.querySelector('input[placeholder="Name"]').value,
    );
    formData.append(
      "description",
      document.querySelector('textarea[placeholder="Product Description"]')
        .value,
    );
    formData.append(
      "price",
      document.querySelector('input[placeholder="Price"]').value,
    );

    try {
      const response = await fetch("http://localhost:3000/user/shop", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      console.log("Item added:", data);

      setIsUploading(false);
      setFile(null);
      close();
      fetchProducts(); // Refresh the table
    } catch (error) {
      console.error("Failed to add item:", error);
      setIsUploading(false);
    }
  }

  // Fetch products from server
  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:3000/user/shop", {
        credentials: "include",
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  // Delete a product
  async function deleteProduct(id) {
    try {
      const response = await fetch(`http://localhost:3000/user/shop/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        fetchProducts(); // Refresh the table
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  function close() {
    setopenPop(!openPop);
  }

  return (
    <>
      <Popup open={openPop} close={close}>
        <form id="AddProduct" onSubmit={handleSubmit}>
          <span>Product Name</span>
          <br />
          <input placeholder="Name" required />
          <br />
          <span>Price</span>
          <br />
          <input placeholder="Price" type="number" required />
          <br />
          <span>Product Description</span>
          <br />
          <textarea placeholder="Product Description" required />
          <br />

          <label className="fileInputLabel">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              required
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
          <br />
          {/* disable button when uploading */}
          <button id="Submit" type="submit" disabled={isUploading}>
            {isUploading ? "Uploading…" : "Add"}
          </button>
        </form>
      </Popup>
      <button id="AddItem" onClick={close}>
        +
      </button>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.ID}>
                <td>{product.ProductName}</td>
                <td>{product.Description}</td>
                <td>{product.Price}</td>
                <td>
                  {product.image && (
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.ProductName}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => deleteProduct(product.ID)}>
                    Delete
                  </button>
                  <button>Edit</button> {/* Placeholder for edit */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

import "./ItemAdder.css";

export default function ItemUpload() {
  return (
    <>
      <div id="OuterDiv">
        <div id="InnerDiv">
          <form id="AddProduct">
            <span>Product Name</span>
            <br />
            <input placeholder="Name"></input>
            <br />
            <span>Product Description</span>
            <br />
            <textarea placeholder="Product Description" />
            <br />
            <input type="file" accept="image/*" />
            <br />
            <button>Add</button>
          </form>
        </div>
      </div>
    </>
  );
}

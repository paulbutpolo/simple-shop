import React, { useState } from "react";

export const Product = ({ product, onDeleteClick, isAdmin }) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setPurchaseQuantity(Math.min(value, product.productQuantity));
  };

  const handlePurchase = () => {
    console.log(product._id, purchaseQuantity)
    onDeleteClick({
      _id: product._id,
      quantity: purchaseQuantity
    });
  };

  const handleDelete = () => {
    
    console.log("Delete product:", product._id);
  };

  return (
    <li>
      <span>{product.productName} (Quantity: {product.productQuantity}) (Price: {product.productPrice})</span>
      <input
        type="number"
        min="1"
        max={product.productQuantity}
        value={purchaseQuantity}
        onChange={handleQuantityChange}
        style={{ width: "60px", margin: "0 10px" }}
      />
       <button onClick={handlePurchase}>Purchase</button>
          {isAdmin && ( // Conditionally render the delete button
              <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
                  Delete
              </button>
          )}
    </li>
  );
};
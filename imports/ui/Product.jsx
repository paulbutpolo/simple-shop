import React, { useState } from "react";


export const Product = ({ product, onPurchaseClick, onDeleteClick, onProductClick, isAdmin }) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setPurchaseQuantity(Math.min(value, product.productQuantity));
  };

  const handlePurchase = () => {
    onPurchaseClick({
      _id: product._id,
      bookId: product.bookId,
      quantity: purchaseQuantity
    });
  };

  const handleDelete = () => {
    onDeleteClick({ _id: product._id });
  };

  const handleProductClick = () => {
    onProductClick({ 
      modalStatus: true,
      bookId: product.bookId,
      product: product
    });
  }

  return (
    <li>
      <div onClick={handleProductClick} style={{ cursor: "pointer" }}>
        <span>
          {product.productName} (Quantity: {product.productQuantity}) (Price: {product.productPrice})
        </span>
      </div>
      <div className="actions">
        <input
          type="number"
          min="1"
          max={product.productQuantity}
          value={purchaseQuantity}
          onChange={handleQuantityChange}
        />
        <button onClick={handlePurchase} style={{ backgroundColor: "Green" }}>Purchase</button>
        {isAdmin && (
          <button onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </li>
  );
};
import React, { useState } from "react";
import Client from "../api/client/Client";

export const ProductForm = () => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Clicked The Add product!")
    if (!text) return;
    
    // // Need to fix this
    Client.callFunc("products.insert", {
      productName: text.trim(),
      productQuantity: 99,
      productPrice: Math.floor(Math.random() * 100) + 1, 
      createdAt: new Date(),
    }); 

    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type to add new tasks"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">Add Product</button>
    </form>
  );
};
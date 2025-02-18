import React, { useState } from "react";
import Client from "../api/client/Client";

export const ProductForm = () => {
  const [isbn, setIsbn] = useState(""); // Use ISBN to fetch book details
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for async operations

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Fetching book details...");

    if (!isbn) return; // Ensure ISBN is provided

    setLoading(true); // Start loading

    try {
      // Fetch book details from BookCollection using ISBN
      const book = await Client.callFunc("books.findByIsbn", { isbn: isbn.trim() });

      if (!book) {
        alert("Book not found!");
        return;
      }

      console.log("Book found:", book);

      // Insert product using book details
      const productId = await Client.callFunc("products.insert", {
        bookId: book._id, // Reference to BookCollection
        productType: "book", // Static value for now
        productName: book.title, // From BookCollection
        productQuantity: productQuantity,
        productPrice: productPrice,
        createdAt: new Date(),
        userId: Meteor.userId(), // I cant use the Client.UserId here. Getting an invalid hook call
      });

      console.log("Product inserted with ID:", productId);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false); // Stop loading
      setIsbn(""); // Clear input
      setProductQuantity("");
      setProductPrice("");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter ISBN to add a book"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        disabled={loading} // Disable input while loading
      />
      <input
        type="number"
        placeholder="Quantity"
        value={productQuantity}
        onChange={(e) => setProductQuantity(parseInt(e.target.value))}
        disabled={loading} // Disable input while loading
      />
      <input
        type="number"
        placeholder="Price"
        value={productPrice}
        onChange={(e) => setProductPrice(parseFloat(e.target.value))}
        disabled={loading} // Disable input while loading
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};
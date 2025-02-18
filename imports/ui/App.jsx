// import RedisVentService from "../api/client/modules/RedisVentService";
// import { ProductCollection } from '../api/ProductCollection';
// import { useTracker } from "meteor/react-meteor-data";
// import { Meteor } from 'meteor/meteor';

import Client from "../api/client/Client";
import React, { useState, Fragment } from 'react';
import { LoginForm } from './LoginForm';
import { Product } from "./Product";
import { AdminComponent } from "./AdminComponent";
import Modal from "./Modal";

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setselectedProduct] = useState(null);
    const [bookDetails, setBookDetails] = useState(null);
    const [error, setError] = useState(null);

    const watcherUser = Client.UserId // Since this is from a "state" then its a hook
    const watcherUserName = Client.UserName // Since this is from a "state" then its a hook
    const roleBoolean = Client.IsUserAdmin
    const logout = () => Client.logout();

    const products = Client.productsDB;
    console.log("Products:", products);

    const handlePurchase = ({ _id, bookId, quantity }) =>
      Client.callFunc("products.buy", { _id, bookId, quantity });

    const handleDelete = ({ _id }) =>
      Client.callFunc("products.delete", { _id });

    const handleProductClick = ({ modalStatus, bookId, product }) => {
      console.log("bookId:", bookId);
      setIsModalOpen(modalStatus);
      setselectedProduct(product);
      setError(null); // Reset error state

      Client.callFunc("getBookDetails", bookId)
      .then((result) => {
        setBookDetails(result); // Store the fetched details in state
      })
      .catch((error) => {
        console.error("Error fetching book details:", error);
        setError("Failed to fetch book details. Please try again.");
      });
    };

    return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>📝️ Simple <s>Shop</s> Book Shop</h1>
          </div>
        </div>
      </header>
      <div className='main'>
        {watcherUser ? (
          <Fragment>
            <div className="user" onClick={logout}>
              { watcherUserName } 🚪
            </div>
            {roleBoolean ? <AdminComponent /> : null}
            <ul className="tasks">
              {products.length > 0 ? (
                products.map(product => (
                  <Product
                    key={product._id}
                    product={product}
                    onPurchaseClick={handlePurchase}
                    onDeleteClick={handleDelete}
                    onProductClick={handleProductClick}
                    isAdmin={roleBoolean}
                  />
                ))
              ) : (
                <li>Loading...</li>
              )}
            </ul>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              {error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : bookDetails ? (
                <div>
                  <h2>{bookDetails.title}</h2>
                  <img
                    src={bookDetails.picture} // Use the book's picture URL
                    alt={bookDetails.title} // Use the book's title as the alt text
                    style={{
                      width: "300px", // Fixed width
                      height: "300px", // Fixed height
                      objectFit: "cover", // Ensures the image covers the area without distortion
                      borderRadius: "8px", // Rounded corners
                      marginBottom: "10px", // Spacing below the image
                    }}
                  />
                  <p>Author: {bookDetails.authorDetails[0].name}</p>
                  <p>Genre: {bookDetails.genreDetails.map(genre => genre.name).join(", ")}</p>
                  <p>Publisher: {bookDetails.publisherDetails[0].name}</p>
                  <p>Price: {selectedProduct.productPrice}</p>
                  <p>Stock Quantity: {selectedProduct.productQuantity}</p>
                  <p>ISBN: {bookDetails.isbn}</p>
                  <p>Publication Date: {new Date(bookDetails.publication_date).toLocaleDateString()}</p>
                  <p>Pages: {bookDetails.pages}</p>
                  <p>Language: {bookDetails.language}</p>
                </div>
              ) : (
                <p>Loading book details...</p>
              )}
            </Modal>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};

export { App };
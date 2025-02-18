import React, { useState } from "react";
import { AuthorForm } from "./AuthorForm";

const AdminComponent = () => {
  const [activeForm, setActiveForm] = useState('author');
  const renderForm = () => {
      switch (activeForm) {
        case 'product':
          return  // <ProductForm />;
        case 'book':
          return // <BookForm />;
        case 'author':
          return <AuthorForm />;
        case 'genre':
          return // <GenreForm />;
        case 'publisher':
          return // <PublisherForm />;
        default:
          return // <ProductForm />;
      }
    }
  return (
    <div className= "admin-component">
      <div className="admin-buttons">
        <button onClick={() => setActiveForm('product')}>Product Form</button>
        <button onClick={() => setActiveForm('book')}>Book Form</button>
        <button onClick={() => setActiveForm('author')}>Author Form</button>
        <button onClick={() => setActiveForm('genre')}>Genre Form</button>
        <button onClick={() => setActiveForm('publisher')}>Publisher Form</button>
      </div>
      <div>
        {renderForm()}
      </div>
    </div>
  );
};

export default AdminComponent;
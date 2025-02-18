import React, { useState } from "react";
import { ProductForm } from './ProductForm';
import { BookForm } from './BookForm';
import { AuthorForm } from './AuthorForm';
import { GenreForm } from './GenreForm';
import { PublisherForm } from './PublisherForm';

export const AdminComponent = () => { 
  const [activeForm, setActiveForm] = useState('product');
  const renderForm = () => {
    switch (activeForm) {
      case 'product':
        return <ProductForm />;
      case 'book':
        return <BookForm />;
      case 'author':
        return <AuthorForm />;
      case 'genre':
        return <GenreForm />;
      case 'publisher':
        return <PublisherForm />;
      default:
        return <ProductForm />;
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
  )
};
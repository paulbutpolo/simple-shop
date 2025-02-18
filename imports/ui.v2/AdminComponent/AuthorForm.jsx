import React, { Fragment, useState } from 'react';
import Client from "../../api.v2/client/Client"
import { AUTHOR } from '../../api.v2/common/Author';

export const AuthorForm = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  React.useEffect(() => {
    Client.fetchData(); // Lazy load on mount.
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Author Submitted:', { name, bio, dateOfBirth });
    // Add logic to save the author to your collection
    const authorId = await Client.callFunc("insert.author", {
            _id: new Mongo.ObjectID(),
            name: name,
            bio: bio,
            date_of_birth: dateOfBirth,
          });
    console.log("Author inserted with ID:", authorId);
    alert("Author added successfully!");
    // Sloppy but got no time
    setName('');
    setBio('');
    setDateOfBirth('');
  };

  return (
    <Fragment>
      <div>
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <button type="submit">Add Author</button>
        </form>
      </div>
      <ul className="tasks">
        {/* {products.length > 0 ? (
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
        )} */}
      </ul>
    </Fragment>
    
  );
};
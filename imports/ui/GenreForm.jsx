import React, { useState } from 'react';
import Client from '../api/client/Client';

export const GenreForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Genre Submitted:', { name, description });
    // Add logic to save the genre to your collection
    const genreId = await Client.callFunc("insert.genre", {
      _id: new Mongo.ObjectID(),
      name: name,
      description: description,
    });
    console.log("Genre inserted with ID:", genreId);
    alert("Genre added successfully!");
    // Sloppy but got no time
    setName('');
    setDescription('');
  };

  return (
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
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Genre</button>
      </form>
    </div>
  );
};
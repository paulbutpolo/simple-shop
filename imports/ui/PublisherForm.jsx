import React, { useState } from 'react';
import Client from '../api/client/Client';

export const PublisherForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Publisher Submitted:', { name, address, email, phoneNumber });
    // Add logic to save the publisher to your collection
    const publisherId = await Client.callFunc("insert.publisher", {
      _id: new Mongo.ObjectID(),
      name: name,
      address: address,
      email: email,
      phone_number: phoneNumber,
    });
    console.log("Publisher inserted with ID:", publisherId);
    alert("Publisher added successfully!");
    // Sloppy but got no time
    setName('');
    setAddress('');
    setEmail('');
    setPhoneNumber('');
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
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button type="submit">Add Publisher</button>
      </form>
    </div>
  );
};
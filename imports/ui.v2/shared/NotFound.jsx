import React from "react";

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'red' }}>404</h1>
      <p style={{ fontSize: '1rem', color: 'gray' }}>Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;

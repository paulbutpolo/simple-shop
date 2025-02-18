import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Login from "./Login";
import SignUp from "./SignUp";
import Header from "../shared/Header";

export default function Auth() {
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);


  const handleLoginSuccess = () => {
    navigate('/');
  };

  return (
    <div className="app">
      <Header />
      <div className='main'>
        {isSigningUp ? (
          <SignUp switchToLogin={() => setIsSigningUp(false)} onSuccess={handleLoginSuccess} />
        ) : (
          <Login switchToSignUp={() => setIsSigningUp(true)} onSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}
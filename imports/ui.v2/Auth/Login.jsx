import React, { useState } from "react";
import Client from "../../api.v2/client/Client";

export default function Login({ switchToSignUp, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();

    Client.login(username, password, (error) => {
      if (error) {
        alert(error.reason);
      } else {
        onSuccess();
      }
    });
  };

  return (
    <form onSubmit={submit} className="login-form">
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <button type="submit">Log In</button>
      </div>

      <div>
        <button type="button" onClick={switchToSignUp}>
          Sign Up
        </button>
      </div>
    </form>
  );
};
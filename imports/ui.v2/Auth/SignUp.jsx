import React, { useState } from "react";
import Client from "../../api.v2/client/Client";
import tmqAccounts from "meteor/tmq:accounts";

export default function SignUp({ switchToLogin, onSuccess }) {
  const roles = tmqAccounts.Roles;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(Object.keys(roles)[0]);

  const submit = (e) => {
    e.preventDefault();
    
    if (password !== retypePassword) {
      alert("Passwords don't match!");
      return;
    }

    tmqAccounts.createUser({ username, email, password, profile: null, role: selectedRole })
      .then(() => {
        Client.login(username, password, (error) => {
          if (error) {
            alert(error.reason);
          } else {
            onSuccess()
          } 
        });
      })
      .catch((error) => {
        alert(error.reason);
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
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="email@email.provider.com"
          name="email"
          required
          onChange={(e) => setEmail(e.target.value)}
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
        <label htmlFor="retype-password">Retype Password</label>
        <input
          type="password"
          placeholder="Retype Password"
          name="retype-password"
          required
          onChange={(e) => setRetypePassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="role">Role</label>
        <select
          name="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          required
        >
          <option value="" disabled>Select a role</option>
          {Object.entries(roles).map(([key, role]) => (
            <React.Fragment key={key}>
              <option value={key}>{role.value}</option>
            </React.Fragment>
          ))}
        </select>
      </div>

      <div>
        <button type="submit">Sign Up</button>
      </div>

      <div>
        <button type="button" onClick={switchToLogin}>
          Back to Login
        </button>
      </div>
    </form>
  );
};
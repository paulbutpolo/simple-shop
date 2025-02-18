import React, { Fragment } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Client from "../api.v2/client/Client";
import Header from "../ui.v2/shared/Header";
import AdminDashboard from "../ui.v2/AdminComponent/Dashboad"; // Import the AdminDashboard component

function App() {
  const watcherUser = Client.UserId;
  const watcherUserRole = Client.UserRole; // Assuming this is a boolean: true for admin, false for regular user
  const logout = () => Client.logout();

  return (
    <div className="app">
      <Header />
      <div className='main'>
        <Fragment>
          <div className="user" onClick={logout}>
            {watcherUser} 🚪
          </div>
          {/* Conditionally render AdminDashboard or default content */}
          {watcherUserRole ? (
            <AdminDashboard /> // Render AdminDashboard if the user is an admin
          ) : (
            <Outlet /> // Render the default content for regular users
          )}
        </Fragment>
      </div>
    </div>
  );
}

export { App };
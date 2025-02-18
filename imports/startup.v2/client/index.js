import React from "react";
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../ui.v2/ProtectedRoute';
import { App } from '../../ui.v2/App';
import Auth from '../../ui.v2/Auth/Auth';
import { NotFound } from '../../ui.v2/shared/NotFound'
import AdminDashboard from '../../ui.v2/AdminComponent/Dashboad'

Meteor.startup(() => {
    const container = document.getElementById('react-target');
    const root = createRoot(container);

    root.render(
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          >
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
});
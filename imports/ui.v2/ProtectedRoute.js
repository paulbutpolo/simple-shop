import tmqAccounts from 'meteor/tmq:accounts';
import Client from '../api.v2/client/Client';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Loader from '../ui.v2/shared/Loader';

const ProtectedRoute = ({ children }) => {
    const watcherUserId = Client.UserId;
    const isReady = useTracker(() => tmqAccounts.IsReady, []);

     if (!isReady) {
        console.log("Loading...")
        return <Loader />;
    }

    if (!watcherUserId) {
        return <Navigate to="/auth" />;
    }

    return children;
};

export default ProtectedRoute;
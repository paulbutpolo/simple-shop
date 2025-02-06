// import RedisVentService from "../api/client/modules/RedisVentService";
// import { ProductCollection } from '../api/ProductCollection';
import { useTracker } from "meteor/react-meteor-data";
// import { Meteor } from 'meteor/meteor';

import Client from "../api/client/Client";
import React, { Fragment } from 'react';
import { LoginForm } from './LoginForm';
import { Product } from "./Product";
import { ProductForm } from "./ProductForm";
import tmqAccounts from "meteor/tmq:accounts";

function App() {
    // This is the standard way
    const isReady = useTracker(() => tmqAccounts.isReady);
    console.log("Current User from the tracker", isReady)
    console.log("Looking:", !Accounts.loggingIn())

    // This is using watchers zustand. Remember if logging a hook we need to declare it first or else its fucked
    const watcherUser = Client.UserId // Since this is from a "state" then its a hook
    console.log("Current User from the watcher:", watcherUser)
    // const watcherUserName = Client.UserName // Since this is from a "state" then its a hook
    // const roleBoolean = Client.IsUserAdmin
    // console.log("From the Getters:", "UserID:", watcherUser, "UserName:", watcherUserName) // Testing
    const logout = () => Client.logout();
    
    const products = Client.productsDB; // I am underimpression that everytime that this thing updates ui will change.
    console.log("Products:", products);

    const handlePurchase = ({ _id, quantity }) =>
      Client.callFunc("products.buy", { _id, quantity });

    return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>📝️ Simple Shop</h1>
          </div>
        </div>
      </header>
      <div className='main'>
        {watcherUser ? (
          <Fragment>
            <div className="user" onClick={logout}>
              { watcherUser } 🚪
            </div>
            {/* <ProductForm />
            <ul className="tasks">
              {products.map(product => (
                <Product
                  key={product._id}
                  product={product}
                  onDeleteClick={handlePurchase}
                  isAdmin={roleBoolean}
                />
              ))}
            </ul> */}
          </Fragment>
          // ""
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};

export { App };
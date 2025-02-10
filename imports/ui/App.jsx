// import RedisVentService from "../api/client/modules/RedisVentService";
// import { ProductCollection } from '../api/ProductCollection';
// import { useTracker } from "meteor/react-meteor-data";
// import { Meteor } from 'meteor/meteor';

import Client from "../api/client/Client";
import React, { Fragment } from 'react';
import { LoginForm } from './LoginForm';
import { Product } from "./Product";
import { ProductForm } from "./ProductForm";

function App() {
    const watcherUser = Client.UserId // Since this is from a "state" then its a hook
    const watcherUserName = Client.UserName // Since this is from a "state" then its a hook
    const roleBoolean = Client.IsUserAdmin
    const logout = () => Client.logout();

    const products = Client.productsDB;
    console.log("Products:", products);

    const handlePurchase = ({ _id, quantity }) =>
      Client.callFunc("products.buy", { _id, quantity });

    const handleDelete = ({ _id }) =>
      Client.callFunc("products.delete", { _id });

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
              { watcherUserName } 🚪
            </div>
            <ProductForm /> 
            <ul className="tasks">
              {products.length > 0 ? (
                products.map(product => (
                  <Product
                    key={product._id}
                    product={product}
                    onPurchaseClick={handlePurchase}
                    onDeleteClick={handleDelete}
                    isAdmin={roleBoolean}
                  />
                ))
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};

export { App };
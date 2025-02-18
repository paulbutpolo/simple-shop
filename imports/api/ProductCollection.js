import { Mongo } from "meteor/mongo";

export const ProductCollection = new Mongo.Collection('products');

// One time only, so this can be removed but if someone is cloning this ill keep it here
Meteor.startup(() => {
  ProductCollection.createIndex({ productType: 1 });
  ProductCollection.createIndex({ productName: 1 });
  ProductCollection.createIndex({ createdAt: 1 });
  ProductCollection.createIndex({ _bookId: 1 });
});
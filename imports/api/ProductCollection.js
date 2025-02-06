import { Mongo } from "meteor/mongo";

export const ProductCollection = new Mongo.Collection('products');

// ProductCollection.allow({
//   insert: function(userId, doc) {
//     return true;
//   },
//   update: function(userId, doc, fields, modifier) {
//     return true;
//   },
//   remove: function(userId, doc) {
//     return true;
//   }
// });

// client and server
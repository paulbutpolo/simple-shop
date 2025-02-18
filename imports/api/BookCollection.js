import { Mongo } from "meteor/mongo";

export const BookCollection = new Mongo.Collection('books');

// One time only, so this can be removed but if someone is cloning this ill keep it here
Meteor.startup(() => {
  BookCollection.createIndex({ title: 1 });
  BookCollection.createIndex({ isbn: 1 }, { unique: true });
  BookCollection.createIndex({ author: 1 });
  BookCollection.createIndex({ genre: 1 });
  BookCollection.createIndex({ publisher: 1 });
  BookCollection.createIndex({ publication_date: 1 });
});
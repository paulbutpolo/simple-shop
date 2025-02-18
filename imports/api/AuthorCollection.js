import { Mongo } from "meteor/mongo";

export const AuthorCollection = new Mongo.Collection('authors');

// One time only, so this can be removed but if someone is cloning this ill keep it here
Meteor.startup(() => {
  AuthorCollection.createIndex({ name: 1 });
});
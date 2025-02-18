import { Mongo } from "meteor/mongo";

export const GenreCollection = new Mongo.Collection('genres');

// One time only, so this can be removed but if someone is cloning this ill keep it here
Meteor.startup(() => {
  GenreCollection.createIndex({ name: 1 });
});
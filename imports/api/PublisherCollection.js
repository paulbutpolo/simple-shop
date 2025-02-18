import { Mongo } from "meteor/mongo";

export const PublisherCollection = new Mongo.Collection('publishers');

// One time only, so this can be removed but if someone is cloning this ill keep it here
Meteor.startup(() => {
  PublisherCollection.createIndex({ name: 1 });
});
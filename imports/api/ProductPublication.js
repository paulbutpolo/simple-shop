import { Meteor } from "meteor/meteor";
import { ProductCollection } from "./ProductCollection";

Meteor.publish("products", function () {
  // console.log("Publication initiated")
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }
  const result = ProductCollection.find();
  // console.log("Current product", result)
  return result
});
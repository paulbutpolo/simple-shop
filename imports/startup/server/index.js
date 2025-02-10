import { Meteor } from 'meteor/meteor';
import Server from '../../api/server/Server';
import { ProductCollection } from "../../api/ProductCollection"

// Okay so I removed redis. To reduce the headache.
Meteor.methods({
  'products.fetch'() {
    // Fetch data from MongoDB
    console.log("Trying to fetch the data in mongoDB by using methods")
    return ProductCollection.find({}).fetch();
  },
  async "products.insert"(doc) {
    const productId = await ProductCollection.insert({
      ...doc,
      userId: this.userId,
    });
    await Server.redisVentTriggerInsert(productId);
    return productId;
  },
  async "products.buy"({ _id, quantity }) {
    const productId = await ProductCollection.update(
      { _id }, 
      { $inc: { productQuantity: -quantity }}
    )
    await Server.redisVentUpdateTrigger(_id, quantity);
    return productId;
  },
  async "products.delete"(_id) {
    const productId = await ProductCollection.remove(_id);
    await Server.redisVentTriggerDelete(_id);
    return productId;
  }
})

Meteor.startup(async () => {
  Server.startUp();
});

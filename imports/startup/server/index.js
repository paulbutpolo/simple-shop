import { Meteor } from 'meteor/meteor';
import Server from '../../api/server/Server';
import { ProductCollection } from "../../api/ProductCollection"

// This one too need to fix this so I can talk to the server again
// Meteor.methods({
//   "products.insert"(doc) {
//     console.log("Parameter:", doc)
//     const productId = ProductCollection.inserAsync({
//       ...doc,
//       userId: this.userId,
//     });
//     return productId; // return the productId
//   },
//   async "products.buy"({ _id, quantity }) {
//     // Validate stock
//     if (product.productQuantity <= 0) {
//       throw new Meteor.Error("no-stock", "No stock boss sorry");
//     }

//     if (product.productQuantity < quantity) {
//       throw new Meteor.Error("insufficient-stock", "Not enough stock available");
//     }

//     // Update stock in MongoDB
//     const updatedQuantity = product.productQuantity - quantity;
//     await ProductCollection.updateAsync(_id, {
//       $set: { productQuantity: updatedQuantity },
//     });

//     return { success: true, message: "Purchase successful", updatedQuantity };
//   },
// });

// Okay so I removed redis. To reduce the headache.
Meteor.methods({
  'products.fetch'() {
    // Fetch data from MongoDB
    console.log("Trying to fetch the data in mongoDB by using methods")
    return ProductCollection.find({}).fetch();
  },
  "products.insert"(doc) {
    console.log("Parameter:", doc)
    const productId = ProductCollection.insert({
      ...doc,
      userId: this.userId,
    });
    return productId;
  },
  "products.buy"({ _id, quantity }) {
    console.log("Parameter: ", "Product ID:", _id, "Quantity:", quantity)
  }
})

Meteor.startup(async () => {
  Server.startUp();
});

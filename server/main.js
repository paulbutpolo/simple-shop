import "../imports/startup/server";

// import { Meteor } from "meteor/meteor";
// import { ProductCollection } from "/imports/api/ProductCollection";
// // import { createClient } from 'redis';
// import "../imports/api/TasksPublications"; 
// import "../imports/api/tasksMethods"; 
// import "../imports/api/ProductPublication"; 
// import "../imports/api/productsMethods"; 

// const redisClient = createClient();

// const insertProduct = (productName, userId) => {
//   ProductCollection.insertAsync({
//     productName,
//     productQuantity: 10,
//     productPrice: Math.floor(Math.random() * 100) + 1,
//     userId,
//     createdAt: new Date(),
//   });
// };

// This is from productsMethods but I can't make the redis work with it so instead of importing it. Now its here :/
// Meteor.methods({
//   async "products.insert"(doc) {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//     }
    
//     const productId = await ProductCollection.insertAsync({
//       ...doc,
//       userId: this.userId,
//     });

//     const product = await ProductCollection.findOneAsync(productId);
//     // console.log(product);
//     // try {
//     //   await redisClient.set(`product:${productId}`, JSON.stringify(product));
//     //   console.log(`Product ${productId} saved to Redis`);
//     // } catch (err) {
//     //   console.error("Failed to save product to Redis:", err);
//     // }
//     return productId;
//   },
//   async "products.buy"({ _id, quantity }) {
//     console.log("products.buy parameters:", _id, quantity);

//     // if (!redisClient.isOpen) {
//     //   await redisClient.connect();
//     // }

//     // Check Redis cache first
//     // const cachedProduct = await redisClient.get(`product:${_id}`);

//     let product = await ProductCollection.findOneAsync(_id);
//     // if (cachedProduct) {
//     //   // Use cached product data
//     //   product = JSON.parse(cachedProduct);
//     //   console.log("Product found in Redis cache:", product);
//     // } else {
//     //   // Fetch product from MongoDB if not in Redis
//     //   product = await ProductCollection.findOneAsync(_id);
//     //   if (!product) {
//     //     throw new Meteor.Error("no-product", "Product is missing");
//     //   }
//     //   // Cache the product in Redis for future use
//     //   await redisClient.set(`product:${_id}`, JSON.stringify(product));
//     //   console.log("Product fetched from MongoDB and cached in Redis:", product);
//     // }

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

//     // Update stock in Redis cache
//     product.productQuantity = updatedQuantity;
//     // await redisClient.set(`product:${_id}`, JSON.stringify(product));
//     // console.log(`Product ${_id} stock updated in Redis: ${updatedQuantity}`);

//     return { success: true, message: "Purchase successful", updatedQuantity };
//   },
// });

// Meteor.startup(async () => {
//   try {
//     // await redisClient.connect();
//     if ((await ProductCollection.find().countAsync()) === 0) {
//       console.log("No products found. Inserting sample data...");
  
//       const sampleProducts = ["Key", "Chest"];
//       sampleProducts.forEach((productName) => {
//         insertProduct(productName, "sampleUserId");
//       });
  
//       console.log("Sample products inserted.");
//     }
//   } catch(err) {
//     return new console.error(err);
//   }
// });

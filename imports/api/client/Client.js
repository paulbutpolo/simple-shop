import RedisVentService from "./modules/RedisVentService"
import { VENT } from "../common/Vent" // I watched the whole video many times but all I know is that this is just to name the Event :/
import meteorwatcher from "meteor/tmq:watcher"
import { Meteor } from "meteor/meteor"
import tmqAccounts from "meteor/tmq:accounts"

// Basic Setup
class Client extends meteorwatcher{
    #listener = null
    #store = null
    #productsDB = null

    constructor(parent) {
      super(parent);
      this.secureTransaction()
      /**
       * @type {Mongo.Collection}
       */
      this.#productsDB =  this.getMiniMongo('products') // I checked the source code for getMiniMongo basically its just put a tag in a new Mongo.Collection(null) so we can have many and we can point it.
      console.log("Current mini-mongo state:", this.#productsDB)

      // On startup I don't know if this is being declared or what
      this.#store = this.create(() => ({
        userId: null,
        userName: null,
        isUserAdmin: false,
        products: [],
      }))
      // Here are the trigger to update the objects? inside the #store
      // Some times there's an issue with this. It's is being called too many times and the amount is random. ranging to 1 to infinity.
      tmqAccounts.onLogin(() => {
        this.#store.setState({ userId: Meteor.userId() });
        this.#store.setState({ userName: this.user().username });
        this.initialData()
      });
      
      tmqAccounts.onLogout(() => {
        this.#store.setState({ userId: null });
        this.#store.setState({ userName: null });
        this.#store.setState({ isUserAdmin: false });
        this.#store.setState({ products: [] });
      })
      this.listen();
    }

    async initialData() {
      const fetchedProducts  = await this.fetchProducts(); // Await the promise
      const role = await tmqAccounts.checkUserRole(Meteor.userId(), "admin") // This is not flexible
      this.#store.setState({ products: fetchedProducts }); // Update the state with the fetched products
      this.#store.setState({ isUserAdmin: role }); // Update the state with the fetched products
    }

    async fetchProducts() {
      const products = await this.callFunc('products.fetch');
      const newProducts = products.filter(product => 
        !this.#productsDB.findOne({ id: product.id })
      );
      
      newProducts.forEach(product => {
        this.#productsDB.insert(product);
      });

      return this.#productsDB.find().fetch();
    }

    // These getters are responsible for updating the UI's I guess
    get productsDB() {
      return this.#store((state => state.products));
    }

    // On startup this is always undefined.
    get UserId() {
      return this.#store((state) => state.userId);
    }

    get UserName() {
      return this.#store((state) => state.userName);
    }

    get IsUserAdmin() {
      return this.#store((state) => state.isUserAdmin);
    }

    listen() {
      console.log("Declared in constructor. Currently Listening.")
      if (!this.#listener) {
        // We listen on the notifier event that the server.js gives to use then we look at the event and do execute the data base on event.
        this.#listener = RedisVentService.Notifier.listen(VENT.NOTIFIER, "123", (({event, data}) => {
          console.log("Basic data", event, data)
          const bulkData = data?.data?.product;
          console.log("Testing-1", bulkData)
          const detailedData = data?.data;
          console.log("Testing-2", detailedData)

          switch (event) {
            case "insert":
              this.#productsDB.insert({_id: bulkData._id, productName: bulkData.productName, productPrice: bulkData.productPrice, productQuantity: bulkData.productQuantity, userId: bulkData.userId, createdAt: bulkData.createdAt})
              const redisVentFetch = this.#productsDB.find({}).fetch() // get the whole mini mongo
              this.#store.setState({ products: redisVentFetch }); // overwrite the producsts in create object
              break;
            case "update":
              this.#productsDB.update({ _id: detailedData._id }, { $inc: {productQuantity: -detailedData.productQuantity} } ) // for some reason findandupdate is not working
              const result = this.#productsDB.findOne({_id: detailedData._id})
              // Step 1: Get the current products array
              const currentProductsArray = this.#store.getState().products // for some reason I can't use this.productsDB here
              // Step 2: Find the index of the product in the products array
              const productIndex = currentProductsArray.findIndex(
                product => product._id === result._id
              );
              if (productIndex !== -1) {
                // Step 3: Create a copy of the products array
                const updatedProducts = [...currentProductsArray];
                // Step 4: Update the specific product
                updatedProducts[productIndex] = { ...updatedProducts[productIndex], ...result };
                // Step 5: Update the store
                this.#store.setState({ products: updatedProducts });
              }

              break;
            case "remove":
              console.log("Removing the product", data._id)
              // Step 1: Find the product in the database then fucking delete it
              const pendingRemove = this.#productsDB.findOne({ _id: data._id })
              this.#productsDB.remove({ _id: data._id })
              
              if (pendingRemove) {
                // Step 2: Get the current products array from the store
                const currentProductsArray = this.#store.getState().products;
            
                // Step 3: Find the index of the product in the products array
                const productIndex = currentProductsArray.findIndex(
                  (product) => product._id === pendingRemove._id
                );
            
                if (productIndex !== -1) {
                  // Step 4: Create a new array without the product to be deleted
                  const updatedProducts = [
                    ...currentProductsArray.slice(0, productIndex), // All elements before the product
                    ...currentProductsArray.slice(productIndex + 1), // All elements after the product
                  ];
            
                  // Step 5: Update the store with the new array
                  this.#store.setState({ products: updatedProducts });
                }
              }
              break;
            case "upsert":
              this.#productsDB.insert({ _id: data.id }, { $set: data })
              break;
          }
        }))
      }
    }
}

export default new Client();
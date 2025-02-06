// import { ClientCollection } from "../clientCollection" // This is where I declared a null Collection
// import { ProductCollection } from "../ProductCollection" // The actual collection that points to mini mongo and mongodb
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
        // userName: null,
        // isUserAdmin: false,
        // products: [],
      }))
    
      // Here are the trigger to update the objects? inside the #store
      // Some times there's an issue with this. It's is being called too many times and the amount is random. ranging to 1 to infinity.
      tmqAccounts.onLogin(() => {
        this.#store.setState({ userId: Meteor.userId() });
        // this.#store.setState({ userName: this.user().username });
        // I think that if the state of the userId change i should do the async.
        // (async () => {
        //   try {
        //     const fetchedProducts  = await this.fetchProducts(); // Await the promise
        //     const role = await tmqAccounts.checkUserRole(Meteor.userId(), "admin") // This is not flexible
        //     this.#store.setState({ products: fetchedProducts }); // Update the state with the fetched products
        //     this.#store.setState({ isUserAdmin: role }); // Update the state with the fetched products
        //   } catch (error) {
        //     console.error('Error handling login:', error);
        //   }
        // })();
      });

      
      tmqAccounts.onLogout(() => {
        this.#store.setState({ userId: null })
        // this.#store.setState({ userName: null })
        // this.#store.setState({ isUserAdmin: true })
        // this.#store.setState({ product: [] }) // This is not being triggered, need confirmation.
      })
      this.listen();
    }

    // These getters are responsible for updating the UI's I guess
    async fetchProducts() {
      try {
        const products = await this.callFunc('products.fetch');
        
        // Filter out products that already exist
        const newProducts = products.filter(product => 
          !this.#productsDB.findOne({ id: product.id })
        );
        
        // Insert only new products
        newProducts.forEach(product => {
          this.#productsDB.insert(product);
        });
    
        // Return the current state of products in the database
        return this.#productsDB.find().fetch();
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    }

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
          console.log("Data From Server.js(redisvent):", data)
          switch (event) { // We will update the client side (this.#productsDB =  this.getMiniMongo('products'))
            case "insert":
              console.log("Mini-mongo Right now:", this.#productsDB.find().fetch())
              console.log("Product name:", data.data.productName)
              this.#productsDB.insert({productName: data.data.productName, productQuantity: data.data.productQuantity, productPrice: data.data.productPrice}) // insertAsync <--
              console.log("Test query to see if its inserted:", this.#productsDB.findOne({productName: data.data.productName}))
              const redisVentFetch = this.#productsDB.find({}).fetch()
              this.#store.setState({ products: redisVentFetch });
              break;
            case "update":
              this.#productsDB.update({ _id: data.id }, { $set: data}) 
              break;
            case "remove":
              this.#productsDB.remove({ _id: data.id })
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
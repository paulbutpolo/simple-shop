import { startRedis } from "meteor/tmq:redisvent";
import RedisVentService from "./modules/RedisVentService";
import { VENT } from "../common/Vent";
import { ProductCollection } from "../ProductCollection";


// I am assuming that his whole file is the one feeding Client.js data but as for where does the Server.js gets the data, I don't know where
class Server {
    #settings = {};
    constructor(settings) {
        this.#settings = settings;
    }
    
    get Config() {
        return this.#settings;
    }

    async startUp() {
      // This is the oplog
      startRedis(this.Config.redisOplog.redis, RedisVentService);
      // This simulates data comming from mongodb
      // let count = 0
      // Meteor.setInterval(() => {
      //   count += 1
      //   console.log(count)
      //   RedisVentService.Notifier.triggerInsert(VENT.NOTIFIER, "123", { productName: `test-data + ${count}`, productQuantity:  Math.floor(Math.random() * 100) + 1, productPrice: Math.floor(Math.random() * 100) + 1});
      // }, 1000 * 5);
    }

    // Actual application of redisvent I think. This is being triggered by the methods so instead of getting updates constantly in the database its only triggered by the users
    // Need security for this though like in the methods calls, it will only do this if the calls are good.
    async redisVentUpdateTrigger(_id, quantity) {
      console.log("From Server.js file", _id, quantity)
      // I am just passing the parameters used and do the operation in the mini-mongo, didnt add verification in product collections
      RedisVentService.Notifier.triggerUpdate(VENT.NOTIFIER, "123", {_id: _id, productQuantity: quantity});
    }

    async redisVentTriggerInsert(id) {
      console.log("Loggin the id here in server.js", id)
      const product = await ProductCollection.findOneAsync({ _id: id }); // Just to confirm
      RedisVentService.Notifier.triggerInsert(VENT.NOTIFIER, "123", {product});
    }

    async redisVentTriggerDelete(id) {
      console.log("Loggin the id here in server.js", id._id)
      RedisVentService.Notifier.triggerRemove(VENT.NOTIFIER, "123", id._id);
    }
}

export default new Server(Meteor.settings);
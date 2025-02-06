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
}

export default new Server(Meteor.settings);
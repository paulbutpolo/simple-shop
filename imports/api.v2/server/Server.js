import { startRedis } from "meteor/tmq:redisvent";
import { Logger } from "meteor/tmq:tools";
import RedisVentService from "./modules/RedisVentService";
import DB, { INDEXES } from "../../startup.v2/server/DB";
// import { VENT } from "../common/Vent";


// I am assuming that his whole file is the one feeding Client.js data but as for where does the Server.js gets the data, I don't know where
class Server {
  #settings = {};
  #functions = {};
  constructor(settings) {
      this.#settings = settings;
  }
    
  get Config() {
      return this.#settings;
  }

  startUp() {
    startRedis(this.Config.redisOplog.redis, RedisVentService);
    return Promise.all([
        this.registerIndexes()
    ]);
  }

  async registerIndexes() {
    try {
        let list = [];
        Logger.showNotice("Registering DB indexes...");
        for (let key in INDEXES) {
            if (!INDEXES[key].length) continue;
            for (let idx in INDEXES[key]) {
                if (!DB[key]) {
                    Logger.showError("Cannot create index for `%s`, not found!", key);
                    continue;
                }
                list.push(DB[key].rawCollection().createIndex(INDEXES[key][idx].key, INDEXES[key][idx].option));
            }
        }
        await Promise.all(list);
        return Logger.showStatus("DB indexes are now set!");
    } catch (error) {
        return Logger.showError("registerIndexes ", error.message || error);
    }
  }
  registerFunctions() {
    Meteor.methods(this.#functions);
  }

  /**
   * 
   * @param {String} name 
   * @param {Function} func 
   */
  addFunction(name, func) {
    if (typeof func != "function") throw new Error("func not a function");
    if (this.#functions[name]) throw new Error(`function "${name}" is already registered`);
    this.#functions[name] = func;
  }

  // async redisVentUpdateTrigger(_id, quantity) {
  //   console.log("From Server.js file", _id, quantity)
  //   RedisVentService.Notifier.triggerUpdate(VENT.NOTIFIER, "123", {_id: _id, productQuantity: quantity});
  // }

  // async redisVentTriggerInsert(id) {
  //   console.log("Loggin the id here in server.js", id)
  //   const product = await ProductCollection.findOneAsync({ _id: id }); // Just to confirm
  //   RedisVentService.Notifier.triggerInsert(VENT.NOTIFIER, "123", {product});
  // }

  // async redisVentTriggerDelete(id) {
  //   console.log("Loggin the id here in server.js", id._id)
  //   RedisVentService.Notifier.triggerRemove(VENT.NOTIFIER, "123", id._id);
  // }
}

export default new Server(Meteor.settings);
import { VentClient } from "meteor/tmq:redisvent";

class RedisVent extends VentClient {
    constructor() {
        super();
    }
    get Notifier() {
        this.setSpace("Notifier", false);
        return this;
    }
}

export default new RedisVent();
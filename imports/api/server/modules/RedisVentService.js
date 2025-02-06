import { VentServer } from "meteor/tmq:redisvent";

class ServerVent extends VentServer {
    constructor() {
        super();
    }
    get Notifier() {
        this.setSpace("Notifier", false);
        return this;
    }
    get Insert() {
      this.setSpace("Insert", false);
      return this;
  }
}

export default new ServerVent();